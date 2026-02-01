import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
                // LOGIN FLOW
                if (!formData.email || !formData.password) {
                    throw { message: 'Please enter your credentials.' };
                }
                const data = await loginTeacher(formData.email, formData.password);

                // Store minimal info
                localStorage.setItem('teacher_id', data.teacher_id);
                localStorage.setItem('teacher_name', data.name);

                navigate('/attendance');
            } else {
                // REGISTRATION FLOW
                if (!formData.name || !formData.email || !formData.password || !formData.className || !formData.subject) {
                    throw { message: 'Please fill in all fields.' };
                }
                const data = await registerTeacher(formData);

                // Auto-login after registration
                localStorage.setItem('teacher_id', data.teacher_id);
                localStorage.setItem('teacher_name', data.name);
                // Save preferences for auto-fill
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

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError(null);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card w-full max-w-md p-8 relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />

                <div className="relative z-10">
                    {/* Main Title */}
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            TRUE-FACE
                        </h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-8 relative">
                        <div
                            className={`absolute w-1/2 h-full top-0 bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out transform ${isLogin ? 'left-0' : 'translate-x-full'}`}
                            style={{ height: 'calc(100% - 8px)', margin: '4px', width: 'calc(50% - 8px)' }}
                        />
                        <button
                            onClick={() => { setIsLogin(true); setError(null); }}
                            className={`flex-1 relative z-10 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ${isLogin ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(null); }}
                            className={`flex-1 relative z-10 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ${!isLogin ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Register
                        </button>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm">
                            {isLogin ? 'Access TRUE-FACE Attendance' : 'Join as a new Teacher'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode='wait'>
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    {/* Teacher Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiUser className="text-gray-400" />
                                            </div>
                                            <input
                                                name="name"
                                                type="text"
                                                className="input-field pl-10"
                                                placeholder="Dr. John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Class */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Class</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiLayers className="text-gray-400" />
                                                </div>
                                                <input
                                                    name="className"
                                                    type="text"
                                                    className="input-field pl-10"
                                                    placeholder="CS-A"
                                                    value={formData.className}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        {/* Subject */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Subject</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiBook className="text-gray-400" />
                                                </div>
                                                <input
                                                    name="subject"
                                                    type="text"
                                                    className="input-field pl-10"
                                                    placeholder="DBMS"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="input-field pl-10"
                                    placeholder="name@college.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-red-50/80 border border-red-100 text-red-600 text-sm font-medium text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center space-x-2 group mt-6"
                        >
                            <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
                            {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>


                </div>
            </motion.div>
        </div>
    );
};

export default Login;
