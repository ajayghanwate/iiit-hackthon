import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

def get_student_by_embedding(embedding: list[float], threshold: float = 0.5):
    """
    Search for closest student embedding using pgvector similarity.
    Assumes a stored procedure 'match_students' exists in Supabase.
    """
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
    response = supabase.table("attendance_sessions").insert({
        "teacher_id": teacher_id,
        "subject": subject
    }).execute()
    return response.data[0] if response.data else None

def mark_student_present(session_id: str, student_id: str):
    response = supabase.table("attendance_records").insert({
        "session_id": session_id,
        "student_id": student_id,
        "status": "present"
    }).execute()
    return response.data

def log_attendance_attempt(session_id: str, teacher_id: str, status: str, present_count: int):
    response = supabase.table("attendance_logs").insert({
        "session_id": session_id,
        "teacher_id": teacher_id,
        "status": status,
        "present_count": present_count
    }).execute()
    return response.data
