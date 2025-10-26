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

  const cardTitles = ['Total Projects', 'Total Developers', 'Total Tasks']
  const cardValues = [stats.totalProjects, stats.totalDevelopers, stats.totalTasks]
  const cardColors = [
    'from-blue-100 to-blue-300',
    'from-green-100 to-green-300',
    'from-purple-100 to-purple-300',
  ]

  if (loading) {
    return <p className="text-center mt-6">Loading dashboard stats...</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {cardTitles.map((title, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${cardColors[index]} shadow-2xl rounded-xl p-8 flex flex-col items-center justify-center transform hover:scale-105 transition-transform`}
          style={{ minHeight: '180px' }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
          <p className="text-4xl font-bold text-gray-900">
            {loading ? '...' : cardValues[index]}
          </p>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard
