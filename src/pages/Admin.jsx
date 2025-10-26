import React, { useState } from "react";
import Register from "../components/Register";
import AdminDashboard from "../components/AdminDashboard";
import { FaRegUserCircle } from "react-icons/fa";

const Admin = () => {
  const [showRegister, setShowRegister] = useState(false);

  const name = sessionStorage.getItem('name');

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Top Navbar */}
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">Project Management</h1>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <FaRegUserCircle className="text-gray-600 text-2xl" />
          </div>
          <span className="font-medium text-gray-700">{name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className={`p-6 ${showRegister ? "filter blur-sm" : ""}`}>
        {/* Create New Project Button */}
        <button
          onClick={() => setShowRegister(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-6"
        >
          Create New User
        </button>

        {/* Render AdminDashboard */}
        <AdminDashboard />
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
          <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <Register />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
