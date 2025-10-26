import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { backend_url } from '../../utils/urlConfing'

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalDevelopers: 0,
    totalManagers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem('token')

        // ✅ Fetch all APIs in parallel
        const [projectsRes, developersRes, managersRes] = await Promise.all([
          axios.get(`${backend_url}/api/total-projects`, {
            headers: { Authorization: `${token}` },
          }),
          axios.get(`${backend_url}/api/total-developers`, {
            headers: { Authorization: `${token}` },
          }),
          axios.get(`${backend_url}/api/total-managers`, {
            headers: { Authorization: `${token}` },
          }),
        ])

        // ✅ Update state safely
        setStats({
          totalProjects: projectsRes?.data?.totalProjects || 0,
          totalDevelopers: developersRes?.data?.totalDevelopers || 0,
          totalManagers: managersRes?.data?.totalManagers || 0,
        })
      } catch (error) {
        console.error('❌ Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Titles, values, colors, and target routes
  const cardData = [
    { title: 'Total Projects', value: stats.totalProjects, color: 'from-blue-200 via-blue-300 to-blue-500', route: '/admin/projects' },
    { title: 'Total Developers', value: stats.totalDevelopers, color: 'from-green-200 via-green-300 to-green-500', route: '/admin/developers' },
    { title: 'Total Managers', value: stats.totalManagers, color: 'from-purple-200 via-purple-300 to-purple-500', route: '/admin/managers' },
  ]

  if (loading) {
    return <p className="text-center mt-6 text-lg font-semibold">Loading dashboard stats...</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 px-4">
      {cardData.map((card, index) => (
        <div
          key={index}
          onClick={() => navigate(card.route)} // ✅ Navigation on click
          className={`cursor-pointer bg-gradient-to-br ${card.color} shadow-2xl rounded-2xl p-10 flex flex-col items-center justify-center transform hover:scale-105 hover:shadow-3xl transition-all duration-300 ease-in-out`}
          style={{ minHeight: '250px' }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{card.title}</h2>
          <p className="text-5xl font-extrabold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard
