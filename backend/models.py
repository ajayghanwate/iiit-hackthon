from pydantic import BaseModel
from typing import List, Optional

class TeacherAuth(BaseModel):
    email: str
    password: str

class StudentRegister(BaseModel):
    name: str
    roll_number: str

class AttendanceMark(BaseModel):
    teacher_id: str
    subject: str

class AttendanceResponse(BaseModel):
    session_id: str
    present_students: List[str]
    unknown_faces: int
    status: str
