import React from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import DeveloperDashboard from '../components/DeveloperDashboard' 

const Developer = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">Project Management</h1>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <FaRegUserCircle className="text-gray-600 text-2xl" />
          </div>
          <span className="font-medium text-gray-700">Developer</span>
        </div>
      </div>

      {/* Dashboard */}
      <div className="p-6">
        <DeveloperDashboard />
      </div>
    </div>
  )
}

export default Developer
