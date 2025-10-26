import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backend_url } from '../../utils/urlConfing'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalDevelopers: 0,
    totalTasks: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem('token')
        const response = await axios.get(`${backend_url}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setStats(response.data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <p className="text-center mt-6">Loading dashboard stats...</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Projects */}
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-700">Total Projects</h2>
        <p className="text-3xl font-bold text-blue-600">{stats.totalProjects}</p>
      </div>

      {/* Total Developers */}
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-700">Total Developers</h2>
        <p className="text-3xl font-bold text-blue-600">{stats.totalDevelopers}</p>
      </div>

      {/* Total Tasks */}
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-700">Total Tasks</h2>
        <p className="text-3xl font-bold text-blue-600">{stats.totalTasks}</p>
      </div>
    </div>
  )
}

export default AdminDashboard
