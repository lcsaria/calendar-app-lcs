import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Login from './login/Login';
import { AuthProvider } from './login/AuthContext';

function RouteTree() {
  return (
    <div>
      <AuthProvider>
      <Router>
            <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </Router>
      </AuthProvider>
        
    </div>
  )
}

export default RouteTree