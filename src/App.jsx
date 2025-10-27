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
import CompletedTasks from './pages/CompletedTasks';
import NewTasks from './pages/NewTasks';
import ActiveTasks from './pages/ActiveTasks';
import ViewTasks from './pages/ViewTasks';

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
        <Route path='/developer/:id/completed-tasks' element={<CompletedTasks />} />
        <Route path='/developer/:id/new-tasks' element={<NewTasks />} />
        <Route path='/developer/:id/active-tasks' element={<ActiveTasks />} />

        <Route path='/manager/:managerId/viewtasks' element={<ViewTasks />} />

        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
      </Routes>
    </Router>
  )
}

export default App
