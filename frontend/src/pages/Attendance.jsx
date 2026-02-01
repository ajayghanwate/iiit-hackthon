import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiLayout } from 'react-icons/fi';
import Camera from '../components/Camera';
import ResultBox from '../components/ResultBox';
import { markAttendance } from '../services/api';

const Attendance = () => {
    const [subject, setSubject] = useState(localStorage.getItem('default_subject') || '');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get Teacher Name for display
    const teacherName = localStorage.getItem('teacher_name') || 'Teacher';

    const handleCapture = async (file, imageSrc) => {
        if (!subject.trim()) {
            setError({ message: 'Please enter a Subject / Class Name first.' });
            return;
        }

        const teacherId = localStorage.getItem('teacher_id');
        if (!teacherId) {
            setError({ message: 'Teacher ID not found. Please log in again.' });
            setTimeout(() => navigate('/'), 2000);
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('teacher_id', teacherId);
            formData.append('subject', subject);
            formData.append('classroom_image', file);

            const response = await markAttendance(formData);
            setResult(response);
        } catch (err) {
            console.error(err);
            setError(err.message ? { message: err.message } : 'Failed to mark attendance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'transparent' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Section */}
                <div className="glass-card" style={{
                    padding: '1.5rem 2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            padding: '0.875rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            color: 'white'
                        }}>
                            <FiLayout style={{ width: '1.5rem', height: '1.5rem' }} />
                        </div>
                        <div>
                            <h1 style={{
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: '0.25rem',
                                letterSpacing: '0.025em'
                            }}>
                                TRUE-FACE
                            </h1>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
                                Welcome, {teacherName}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/students/register')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.25rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <span>+ Register Student</span>
                        </button>
                        <button
                            onClick={() => { localStorage.clear(); navigate('/'); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.25rem',
                                background: 'white',
                                color: '#6b7280',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                borderRadius: '0.75rem',
                                border: '2px solid rgba(156, 163, 175, 0.3)',
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#dc2626'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = 'rgba(156, 163, 175, 0.3)'; }}
                        >
                            <FiLogOut />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="responsive-grid">
                    {/* Left Column: Input & Results */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-card" style={{ padding: '2rem', boxSizing: 'border-box' }}>
                            <label htmlFor="subject" style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                color: '#667eea',
                                marginBottom: '0.75rem',
                                letterSpacing: '0.025em'
                            }}>
                                📚 Current Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g., Mathematics, CS101"
                                className="input-field"
                                style={{ marginBottom: '0.75rem' }}
                            />
                            <p style={{
                                fontSize: '0.75rem',
                                color: '#9ca3af',
                                lineHeight: '1.5',
                                fontWeight: '500'
                            }}>
                                💡 Enter the subject code or name before capturing.
                            </p>
                        </div>

                        <ResultBox result={result} error={error} />
                    </div>

                    {/* Right Column: Camera */}
                    <div style={{ minWidth: 0 }}>
                        <Camera onCapture={handleCapture} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
