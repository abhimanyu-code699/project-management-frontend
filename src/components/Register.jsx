import React, { useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { backend_url } from '../../utils/urlConfing'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone,setPhone] = useState('');
  const [role, setRole] = useState('developer')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!name || !email || !password || !role || !phone) {
      toast.error('All fields are required')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${backend_url}/auth/register`, {
        name,
        email,
        password,
        role,
        phone
      })

      toast.success(response.data.message || 'User registered successfully!')
      // Clear form
      setName('')
      setEmail('')
      setPassword('')
      setRole('developer')
      setPhone('');
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
          Register User
        </h1>
        <form className="space-y-6" onSubmit={handleRegister}>
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="phone"
              id="phone"
              value={phone}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="developer">developer</option>
              <option value="manager">manager</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition-colors ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
