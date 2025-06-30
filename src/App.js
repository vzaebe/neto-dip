import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserIndex from './components/UserIndex';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import Hall from './components/Hall';
import Payment from './components/Payment';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<UserIndex />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/hall" element={<Hall />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 