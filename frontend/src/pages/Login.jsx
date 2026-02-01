import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiUser, FiBook, FiLayers } from 'react-icons/fi';
import { loginTeacher, registerTeacher } from '../services/api';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        className: '',
        subject: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                if (!formData.email || !formData.password) throw { message: 'Please enter your credentials.' };
                const data = await loginTeacher(formData.email, formData.password);
                localStorage.setItem('teacher_id', data.teacher_id);
                localStorage.setItem('teacher_name', data.name);
                navigate('/attendance');
            } else {
                if (!formData.name || !formData.email || !formData.password || !formData.className || !formData.subject) {
                    throw { message: 'Please fill in all fields.' };
                }
                const data = await registerTeacher(formData);
                localStorage.setItem('teacher_id', data.teacher_id);
                localStorage.setItem('teacher_name', data.name);
                localStorage.setItem('default_subject', data.subject);
                localStorage.setItem('default_class', data.className);
                navigate('/attendance');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout-center">
            {/* Card Container */}
            <div className="glass-card" style={{
                width: '100%',
                maxWidth: '480px',
                padding: '2rem 2rem',
                boxSizing: 'border-box'
            }}>

                {/* Header Section */}
                <div className="text-center mb-6">
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '0.5rem',
                        letterSpacing: '0.025em'
                    }}>
                        TRUE-FACE
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
                        {isLogin ? 'Welcome back, Educator' : 'Join the Future of Attendance'}
                    </p>
                </div>

                {/* Toggle Tabs */}
                <div style={{
                    display: 'flex',
                    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    padding: '0.375rem',
                    borderRadius: '0.875rem',
                    marginBottom: '2rem',
                    position: 'relative',
                    border: '1px solid rgba(156, 163, 175, 0.2)',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
                    <div
                        style={{
                            position: 'absolute',
                            width: 'calc(50% - 0.375rem)',
                            height: 'calc(100% - 0.75rem)',
                            top: '0.375rem',
                            background: 'white',
                            borderRadius: '0.625rem',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isLogin ? 'translateX(0.375rem)' : 'translateX(calc(100% + 0.375rem))'
                        }}
                    />
                    <button
                        onClick={() => { setIsLogin(true); setError(null); }}
                        style={{
                            flex: 1,
                            position: 'relative',
                            zIndex: 10,
                            padding: '0.625rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            borderRadius: '0.625rem',
                            transition: 'all 0.3s',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: isLogin ? '#667eea' : '#6b7280'
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(null); }}
                        style={{
                            flex: 1,
                            position: 'relative',
                            zIndex: 10,
                            padding: '0.625rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            borderRadius: '0.625rem',
                            transition: 'all 0.3s',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: !isLogin ? '#764ba2' : '#6b7280'
                        }}
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {!isLogin && (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="input-wrapper">
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    marginBottom: '0.5rem',
                                    marginLeft: '0.25rem',
                                    color: '#6366f1',
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
                                        name="name"
                                        type="text"
                                        className="input-field"
                                        style={{ paddingLeft: '3rem' }}
                                        placeholder="Dr. Alex Carter"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-wrapper">
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        marginBottom: '0.5rem',
                                        marginLeft: '0.25rem',
                                        color: '#8b5cf6',
                                        letterSpacing: '0.025em'
                                    }}>
                                        📚 Class
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <FiLayers style={{
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
                                            name="className"
                                            type="text"
                                            className="input-field"
                                            style={{ paddingLeft: '3rem' }}
                                            placeholder="CS-A"
                                            value={formData.className}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="input-wrapper">
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        marginBottom: '0.5rem',
                                        marginLeft: '0.25rem',
                                        color: '#ec4899',
                                        letterSpacing: '0.025em'
                                    }}>
                                        📖 Subject
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <FiBook style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '1.25rem',
                                            height: '1.25rem',
                                            pointerEvents: 'none',
                                            color: '#f472b6'
                                        }} />
                                        <input
                                            name="subject"
                                            type="text"
                                            className="input-field"
                                            style={{ paddingLeft: '3rem' }}
                                            placeholder="DBMS"
                                            value={formData.subject}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="input-wrapper delay-100 animate-slide-up" style={{ animationFillMode: 'backwards' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem',
                            marginLeft: '0.25rem',
                            color: '#3b82f6',
                            letterSpacing: '0.025em'
                        }}>
                            ✉️ Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '1.25rem',
                                height: '1.25rem',
                                pointerEvents: 'none',
                                color: '#60a5fa'
                            }} />
                            <input
                                name="email"
                                type="email"
                                required
                                className="input-field"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="name@college.edu"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-wrapper delay-200 animate-slide-up" style={{ animationFillMode: 'backwards' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem',
                            marginLeft: '0.25rem',
                            color: '#10b981',
                            letterSpacing: '0.025em'
                        }}>
                            🔒 Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '1.25rem',
                                height: '1.25rem',
                                pointerEvents: 'none',
                                color: '#34d399'
                            }} />
                            <input
                                name="password"
                                type="password"
                                required
                                className="input-field"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="animate-fade-in" style={{
                            padding: '0.875rem',
                            borderRadius: '0.75rem',
                            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            textAlign: 'center',
                            boxShadow: '0 1px 3px rgba(220, 38, 38, 0.1)'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary delay-300 animate-slide-up"
                        style={{ animationFillMode: 'backwards', marginTop: '0.5rem' }}
                    >
                        <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
                        {!loading && <FiArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />}
                    </button>
                </form>

                {/* Footer */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>
                        © 2026 True-Face Systems
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
