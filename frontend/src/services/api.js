import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Match FastAPI port

// MOCK MODE: Set to true to bypass backend
const MOCK_MODE = true;

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const registerTeacher = async (teacherData) => {
    if (MOCK_MODE) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const teacherId = 'teacher-' + Date.now();
                const teacher = {
                    teacher_id: teacherId,
                    name: teacherData.name,
                    email: teacherData.email,
                    subject: teacherData.subject,
                    className: teacherData.className,
                    password: teacherData.password
                };

                // Save to localStorage
                const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
                teachers.push(teacher);
                localStorage.setItem('teachers', JSON.stringify(teachers));

                resolve({
                    success: true,
                    message: "Registration successful",
                    teacher_id: teacherId,
                    name: teacher.name,
                    email: teacher.email,
                    subject: teacher.subject,
                    className: teacher.className
                });
            }, 1000);
        });
    }

    try {
        const response = await api.post('/teacher/register', teacherData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

export const registerStudent = async (studentData) => {
    // studentData should be FormData containing name, roll_number, face_image
    if (MOCK_MODE) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const studentId = 'student-' + Date.now();
                const student = {
                    student_id: studentId,
                    name: studentData.get('name'),
                    roll_number: studentData.get('roll_number'),
                    registered_at: new Date().toISOString()
                };

                // Save to localStorage
                const students = JSON.parse(localStorage.getItem('students') || '[]');
                students.push(student);
                localStorage.setItem('students', JSON.stringify(students));

                resolve({
                    success: true,
                    message: "Student registered successfully",
                    student_id: studentId
                });
            }, 1000);
        });
    }

    try {
        const response = await api.post('/students/register', studentData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

export const loginTeacher = async (email, password) => {
    if (MOCK_MODE) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check localStorage for registered teachers
                const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
                const teacher = teachers.find(t => t.email === email && t.password === password);

                if (teacher) {
                    resolve({
                        teacher_id: teacher.teacher_id,
                        name: teacher.name
                    });
                } else if (email && password) {
                    // Fallback for demo
                    resolve({ teacher_id: 'demo-teacher-123', name: 'Demo Teacher' });
                } else {
                    reject({ message: 'Invalid credentials' });
                }
            }, 1000);
        });
    }

    try {
        const response = await api.post('/teacher/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

export const markAttendance = async (formData) => {
    if (MOCK_MODE) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const students = JSON.parse(localStorage.getItem('students') || '[]');
                const presentCount = students.length > 0 ? students.length : Math.floor(Math.random() * 10) + 20;

                const attendance = {
                    session_id: 'session-' + Date.now(),
                    subject: formData.get('subject'),
                    present_count: presentCount,
                    timestamp: new Date().toISOString()
                };

                // Save attendance record
                const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');
                records.push(attendance);
                localStorage.setItem('attendance_records', JSON.stringify(records));

                resolve({
                    success: true,
                    subject: attendance.subject,
                    present_count: presentCount,
                    timestamp: attendance.timestamp
                });
            }, 1500);
        });
    }

    try {
        const response = await api.post('/attendance/mark', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

export default api;
