import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-10"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-600 rounded-xl shadow-lg text-white">
                            <FiLayout className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-purple-800">
                                TRUE-FACE
                            </h1>
                            <p className="text-gray-500 text-sm">Welcome, {teacherName}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { localStorage.clear(); navigate('/'); }}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors font-medium bg-white/50 px-4 py-2 rounded-lg border border-gray-200"
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Input & Results */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6"
                        >
                            <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Current Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. CS101"
                                className="input-field"
                            />
                            <p className="mt-2 text-xs text-gray-400">Enter the subject code or name before capturing.</p>
                        </motion.div>

                        <ResultBox result={result} error={error} />
                    </div>

                    {/* Right Column: Camera */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Camera onCapture={handleCapture} loading={loading} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
