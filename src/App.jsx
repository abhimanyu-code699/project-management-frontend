import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Manager from './pages/Manager';
import Developer from './pages/Developer';
import ProtectedRoute from './components/ProtectedRoute';
import TotalManagers from './pages/TotalManagers';
import TotalDevelopers from './pages/TotalDevelopers';
import TotalProjects from './pages/TotalProjects';
import DeveloperProjects from './pages/DeveloperProjects';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route 
          path='/admin'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <Manager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/developer"
          element={
            <ProtectedRoute allowedRoles={['developer']}>
              <Developer />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/admin/developers'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TotalDevelopers />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/admin/managers'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TotalManagers />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/admin/projects'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TotalProjects />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/admin/developers/${id}'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DeveloperProjects />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
      </Routes>
    </Router>
  )
}

export default App
