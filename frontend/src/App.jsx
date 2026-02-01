import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Attendance from './pages/Attendance';

import StudentRegister from './pages/StudentRegister';

function App() {
  return (
    <Router>
      <div className="antialiased text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/students/register" element={<StudentRegister />} />
          {/* Default redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
