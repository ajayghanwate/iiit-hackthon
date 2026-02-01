import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_KEY", "")

# Create client with error handling
try:
    if url and key and not url.startswith("https://placeholder"):
        supabase: Client = create_client(url, key)
        print("✅ Supabase connected successfully")
    else:
        print("⚠️  Warning: Supabase credentials not configured. Database operations will fail.")
        print("   Please add real credentials to backend/.env file")
        supabase = None
except Exception as e:
    print(f"⚠️  Supabase connection error: {e}")
    supabase = None

def get_student_by_embedding(embedding: list[float], threshold: float = 0.5):
    """
    Search for closest student embedding using pgvector similarity.
    Assumes a stored procedure 'match_students' exists in Supabase.
    """
    if not supabase:
        print("⚠️  Supabase not configured - cannot match embeddings")
        return []
    
    try:
        response = supabase.rpc(
            "match_students",
            {
                "query_embedding": embedding,
                "match_threshold": threshold,
                "match_count": 1
            }
        ).execute()
        return response.data
    except Exception as e:
        print(f"Error matching embedding: {e}")
        return []

def create_attendance_session(teacher_id: str, subject: str):
    if not supabase:
        return None
    response = supabase.table("attendance_sessions").insert({
        "teacher_id": teacher_id,
        "subject": subject
    }).execute()
    return response.data[0] if response.data else None

def mark_student_present(session_id: str, student_id: str):
    if not supabase:
        return None
    response = supabase.table("attendance_records").insert({
        "session_id": session_id,
        "student_id": student_id,
        "status": "present"
    }).execute()
    return response.data

def log_attendance_attempt(session_id: str, teacher_id: str, status: str, present_count: int):
    if not supabase:
        return None
    response = supabase.table("attendance_logs").insert({
        "session_id": session_id,
        "teacher_id": teacher_id,
        "status": status,
        "present_count": present_count
    }).execute()
    return response.data
