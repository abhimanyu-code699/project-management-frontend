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
      const response = await axios.post(`${backend_url}/auth/login`, {
        email,
        password,
      })

      const data = response.data
      if (data.token) {
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('role', data.user.role)
        sessionStorage.setItem('name',data.user.name);
        sessionStorage.setItem('id',data.user.id);
      }

      toast.success(data.message || 'Login successful!', {
        autoClose: 2000,
        onClose: () => {
          if (data.user.role === 'admin') navigate('/admin')
          else if (data.user.role === 'developer') navigate('/developer')
          else if(data.user.role === 'manager') navigate('/manager')
          else navigate('/')
        },
      })
    } catch (error) {
      const errMsg =
        error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Bespoke Technology
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">Project Management</p>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition-colors ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          &copy; 2025 Bespoke Technology. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login
