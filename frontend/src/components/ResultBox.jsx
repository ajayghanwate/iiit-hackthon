import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiUser, FiUsers, FiClock } from 'react-icons/fi';

const ResultBox = ({ result, error }) => {
    return (
        <AnimatePresence>
            {(result || error) && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`mt-6 w-full max-w-2xl p-6 rounded-2xl shadow-xl backdrop-blur-md border ${error
                            ? 'bg-red-50/90 border-red-200'
                            : 'bg-white/80 border-white/50'
                        }`}
                >
                    {error && (
                        <div className="flex items-center text-red-700">
                            <div className="p-3 bg-red-100 rounded-full mr-4">
                                <FiAlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Verification Failed</h3>
                                <p className="text-red-900/80">{error.message || 'An unknown error occurred.'}</p>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div>
                            <div className="flex items-center mb-6 text-green-700">
                                <div className="p-3 bg-green-100 rounded-full mr-4">
                                    <FiCheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">Attendance Marked</h3>
                                    <p className="text-green-800/70 text-sm">Successfully recorded in system</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/60 p-4 rounded-xl border border-white/50 shadow-sm flex items-center space-x-3">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <FiUser className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="block text-xs uppercase tracking-wide text-gray-500 font-bold">Subject</span>
                                        <span className="font-semibold text-gray-800">{result.subject || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="bg-white/60 p-4 rounded-xl border border-white/50 shadow-sm flex items-center space-x-3">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <FiUsers className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="block text-xs uppercase tracking-wide text-gray-500 font-bold">Students Present</span>
                                        <span className="font-semibold text-gray-800">{result.present_count || result.count || '0'}</span>
                                    </div>
                                </div>
                            </div>
                            {result.timestamp && (
                                <div className="mt-4 flex items-center text-xs text-gray-400 justify-end">
                                    <FiClock className="mr-1" />
                                    {new Date(result.timestamp).toLocaleString()}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResultBox;
