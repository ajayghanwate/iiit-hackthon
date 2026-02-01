import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUserPlus, FiArrowLeft, FiUser, FiInfo } from 'react-icons/fi';
import Camera from '../components/Camera';
import { registerStudent } from '../services/api';

const StudentRegister = () => {
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleCapture = async (file, imageSrc) => {
        if (!name.trim() || !rollNumber.trim()) {
            setError('Please enter Student Name and Roll Number first.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('roll_number', rollNumber);
            formData.append('face_image', file);

            await registerStudent(formData);
            setSuccess(`Student ${name} registered successfully!`);
            setName('');
            setRollNumber('');
        } catch (err) {
            console.error(err);
            setError(err.detail || err.message || 'Failed to register student.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'transparent' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <button
                        onClick={() => navigate('/attendance')}
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
                            transition: 'all 0.3s',
                            boxSizing: 'border-box'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#667eea'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#667eea'; }}
                    >
                        <FiArrowLeft />
                        <span>Back to Dashboard</span>
                    </button>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '0.025em'
                    }}>
                        Register New Student
                    </h1>
                </div>

                {/* Main Content */}
                <div className="responsive-grid">
                    {/* Left Column: Input Form */}
                    <div>
                        <div className="glass-card" style={{ padding: '2rem', boxSizing: 'border-box' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '1.5rem',
                                color: '#667eea'
                            }}>
                                <FiUserPlus style={{ width: '1.5rem', height: '1.5rem' }} />
                                <h2 style={{ fontWeight: '700', fontSize: '1.125rem' }}>Student Details</h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        color: '#6366f1',
                                        marginBottom: '0.5rem',
                                        letterSpacing: '0.025em'
                                    }}>
                                        👤 Full Name
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <FiUser style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '1.25rem',
                                            height: '1.25rem',
                                            pointerEvents: 'none',
                                            color: '#818cf8'
                                        }} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Jane Doe"
                                            className="input-field"
                                            style={{ paddingLeft: '3rem' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        color: '#8b5cf6',
                                        marginBottom: '0.5rem',
                                        letterSpacing: '0.025em'
                                    }}>
                                        🎓 Roll Number
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <FiInfo style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '1.25rem',
                                            height: '1.25rem',
                                            pointerEvents: 'none',
                                            color: '#a78bfa'
                                        }} />
                                        <input
                                            type="text"
                                            value={rollNumber}
                                            onChange={(e) => setRollNumber(e.target.value)}
                                            placeholder="2024CS001"
                                            className="input-field"
                                            style={{ paddingLeft: '3rem' }}
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)',
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    marginTop: '0.5rem'
                                }}>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: '#667eea',
                                        lineHeight: '1.5',
                                        fontWeight: '500'
                                    }}>
                                        📸 <strong>Next Step:</strong> After filling in the details, use the camera to capture the student's face for registration.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Success/Error Messages */}
                        {success && (
                            <div className="animate-fade-in" style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                border: '1px solid #86efac',
                                color: '#16a34a',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                textAlign: 'center',
                                boxShadow: '0 1px 3px rgba(22, 163, 74, 0.1)'
                            }}>
                                ✓ {success}
                            </div>
                        )}

                        {error && (
                            <div className="animate-fade-in" style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                textAlign: 'center',
                                boxShadow: '0 1px 3px rgba(220, 38, 38, 0.1)'
                            }}>
                                ⚠ {error}
                            </div>
                        )}
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

export default StudentRegister;
