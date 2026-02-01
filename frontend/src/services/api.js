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
                // In a real app, you'd save this to DB. 
                // Here we just return success and the mock ID.
                resolve({
                    success: true,
                    message: "Registration successful",
                    teacher_id: 'mock-teacher-' + Date.now(),
                    name: teacherData.name,
                    email: teacherData.email,
                    subject: teacherData.subject,
                    className: teacherData.className
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
                resolve({
                    success: true,
                    message: "Student registered successfully",
                    student_id: 'mock-student-' + Date.now()
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
                if (email && password) {
                    resolve({ teacher_id: 'mock-teacher-123', name: 'Demo Teacher' });
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
                resolve({
                    success: true,
                    subject: formData.get('subject'),
                    present_count: Math.floor(Math.random() * 10) + 20, // Random count between 20-30
                    timestamp: new Date().toISOString()
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
