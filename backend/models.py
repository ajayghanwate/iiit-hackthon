from pydantic import BaseModel
from typing import List, Optional

class TeacherAuth(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    teacher_class: Optional[str] = None
    subject: Optional[str] = None

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

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    roll_number: Optional[str] = None
    is_active: Optional[bool] = None
