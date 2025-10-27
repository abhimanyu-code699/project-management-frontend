import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { backend_url } from '../../utils/urlConfing'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !password) {
      toast.error('Email and password are required.')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${backend_url}/auth/login`, { email, password })
      const data = response.data

      if (data.token) {
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('role', data.user.role)
        sessionStorage.setItem('name', data.user.name)
        sessionStorage.setItem('id', data.user.id)
      }

      toast.success(data.message || 'Login successful!', {
        autoClose: 2000,
        onClose: () => {
          if (data.user.role === 'admin') navigate('/admin')
          else if (data.user.role === 'developer') navigate('/developer')
          else if (data.user.role === 'manager') navigate('/manager')
          else navigate('/')
        },
      })
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Login Card */}
      <div className="relative bg-white/70 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl p-10 w-full max-w-md transition-all hover:shadow-blue-200">
        {/* Floating Logo */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-3xl font-bold">BT</span>
        </div>

        <div className="mt-12 text-center">
          <h1 className="text-3xl font-bold text-blue-700">Bespoke Technology</h1>
          <p className="text-gray-600 mt-1 mb-8">Project Management System</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-[1.02] ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-blue-300'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          &copy; 2025 <span className="font-semibold text-blue-600">Bespoke Technology</span> — All rights reserved.
        </p>

        <div className="mt-5 bg-blue-50/70 border border-blue-200 rounded-lg shadow-sm p-4 text-center">
          <p className="text-gray-700 font-semibold mb-2">🧑‍💼 Admin Demo Login</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-700">Email:</span> admin@gmail.com
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-700">Password:</span> admin@123
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
