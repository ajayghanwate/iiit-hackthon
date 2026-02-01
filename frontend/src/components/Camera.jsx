import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { FiCamera } from 'react-icons/fi';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const Camera = ({ onCapture, loading }) => {
    const webcamRef = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    onCapture(file, imageSrc);
                });
        }
    }, [webcamRef, onCapture]);

    return (
        <div className="flex flex-col items-center space-y-6 w-full">
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-video group">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    height="100%"
                    videoConstraints={videoConstraints}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Scanning Overlay Animation */}
                <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-70 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10"
                />
                <div className="absolute inset-0 bg-indigo-900/10 pointer-events-none" />
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={capture}
                disabled={loading}
                className="btn-primary w-full max-w-xs flex items-center justify-center space-x-3 text-lg"
            >
                <FiCamera className="w-6 h-6" />
                <span>{loading ? 'Processing...' : 'Capture Attendance'}</span>
            </motion.button>
        </div>
    );
};

export default Camera;
