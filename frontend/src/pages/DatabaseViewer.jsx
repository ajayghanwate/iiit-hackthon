import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDatabase, FiArrowLeft, FiUsers, FiUserCheck, FiCalendar } from 'react-icons/fi';

const DatabaseViewer = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load data from localStorage
        setTeachers(JSON.parse(localStorage.getItem('teachers') || '[]'));
        setStudents(JSON.parse(localStorage.getItem('students') || '[]'));
        setAttendance(JSON.parse(localStorage.getItem('attendance_records') || '[]'));
    }, []);

    return (
        <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'transparent' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            background: 'white',
                            color: '#667eea',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            borderRadius: '0.75rem',
                            border: '2px solid #667eea',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s'
                        }}
                    >
                        <FiArrowLeft />
                        <span>Back to Home</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FiDatabase style={{ width: '2rem', height: '2rem', color: '#667eea' }} />
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Database Viewer
                        </h1>
                    </div>
                </div>

                {/* Teachers Section */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <FiUsers style={{ width: '1.5rem', height: '1.5rem', color: '#667eea' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>
                            Teachers ({teachers.length})
                        </h2>
                    </div>

                    {teachers.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>ID</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Name</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Email</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Subject</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Class</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teachers.map((teacher, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>{teacher.teacher_id}</td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>{teacher.name}</td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>{teacher.email}</td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>{teacher.subject}</td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>{teacher.className}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No teachers registered yet</p>
                    )}
                </div>

                {/* Students Section */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <FiUserCheck style={{ width: '1.5rem', height: '1.5rem', color: '#8b5cf6' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>
                            Students ({students.length})
                        </h2>
                    </div>

                    {students.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>ID</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Name</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Roll Number</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Registered At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>{student.student_id}</td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>{student.name}</td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>{student.roll_number}</td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                                                {new Date(student.registered_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No students registered yet</p>
                    )}
                </div>

                {/* Attendance Section */}
                <div className="glass-card" style={{ padding: '2rem', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <FiCalendar style={{ width: '1.5rem', height: '1.5rem', color: '#10b981' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                            Attendance Records ({attendance.length})
                        </h2>
                    </div>

                    {attendance.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Session ID</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Subject</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Present Count</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.map((record, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>{record.session_id}</td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>{record.subject}</td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    background: '#dcfce7',
                                                    color: '#16a34a',
                                                    borderRadius: '0.5rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {record.present_count}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                                                {new Date(record.timestamp).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No attendance records yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatabaseViewer;
