from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import database as db
import face_engine
from models import TeacherAuth, AttendanceResponse, StudentUpdate
import json

app = FastAPI(title="AI Attendance System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/students")
async def get_students():
    try:
        res = db.supabase.table("students").select("*").order("name").execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    face_engine.warmup()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/teacher/signup")
async def signup(auth: TeacherAuth):
    try:
        res = db.supabase.auth.sign_up({
            "email": auth.email,
            "password": auth.password
        })
        if res.user:
            # Sync to teachers table if needed
            db.supabase.table("teachers").insert({
                "id": res.user.id, 
                "email": auth.email,
                "full_name": auth.full_name,
                "class": auth.teacher_class,
                "subject": auth.subject
            }).execute()
            return {"message": "Teacher registered successfully", "user_id": res.user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/teacher/login")
async def login(auth: TeacherAuth):
    try:
        res = db.supabase.auth.sign_in_with_password({
            "email": auth.email,
            "password": auth.password
        })
        if res.user:
            return {"message": "Login successful", "access_token": res.session.access_token, "teacher_id": res.user.id}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/students/register")
async def register_student(
    name: str = Form(...),
    roll_number: str = Form(...),
    face_image: UploadFile = File(...)
):
    try:
        image_bytes = await face_image.read()
        embedding = face_engine.get_single_face_embedding(image_bytes)
        
        # 1. Insert student
        student_res = db.supabase.table("students").insert({
            "name": name,
            "roll_number": roll_number
        }).execute()
        
        if not student_res.data:
            raise HTTPException(status_code=500, detail="Failed to register student")
        
        student_id = student_res.data[0]["id"]
        
        # 2. Insert embedding
        db.supabase.table("student_embeddings").insert({
            "student_id": student_id,
            "embedding": embedding
        }).execute()
        
        return {"message": "Student registered successfully", "student_id": student_id}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/attendance/mark", response_model=AttendanceResponse)
async def mark_attendance(
    teacher_id: str = Form(...),
    subject: str = Form(...),
    classroom_image: UploadFile = File(...)
):
    try:
        image_bytes = await classroom_image.read()
        
        # 1. Create session
        session = db.create_attendance_session(teacher_id, subject)
        if not session:
            raise HTTPException(status_code=500, detail="Failed to create session")
        
        session_id = session["id"]
        
        # 2. Process image for multiple faces
        embeddings = face_engine.process_classroom_image(image_bytes)
        
        present_student_ids = []
        present_student_names = []
        unknown_faces = 0
        
        # 3. Match each face with DB
        for emb in embeddings:
            matches = db.get_student_by_embedding(emb)
            if matches:
                student_id = matches[0]["student_id"]
                student_name = matches[0]["student_name"]
                if student_id not in present_student_ids:
                    present_student_ids.append(student_id)
                    present_student_names.append(student_name)
                    db.mark_student_present(session_id, student_id)
            else:
                unknown_faces += 1
        
        # 4. Log the result
        db.log_attendance_attempt(
            session_id=session_id,
            teacher_id=teacher_id,
            status="completed",
            present_count=len(present_student_ids),
            student_names=", ".join(present_student_names)
        )
        
        return {
            "session_id": session_id,
            "present_students": present_student_ids,
            "present_names": present_student_names,
            "unknown_faces": unknown_faces,
            "status": "success"
        }
        
    except Exception as e:
        # Log failure if session exists
        # In a real app we'd handle session_id better here
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/students/{student_id}")
async def update_student(student_id: str, student_data: StudentUpdate):
    try:
        # Filter out None values to allow partial updates
        update_data = {k: v for k, v in student_data.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields provided for update")
            
        res = db.supabase.table("students").update(update_data).eq("id", student_id).execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail="Student not found")
            
        return {"message": "Student updated successfully", "data": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/students/{student_id}")
async def delete_student(student_id: str):
    try:
        # We can either do a hard delete or just set is_active to False
        # The user said "leave college permanently", sometimes hard delete is preferred
        # but soft delete is safer. Let's do a hard delete as it's a "permanent" leave.
        res = db.supabase.table("students").delete().eq("id", student_id).execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail="Student not found")
            
        return {"message": "Student removed from system permanently"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
