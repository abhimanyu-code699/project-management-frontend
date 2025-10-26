import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backend_url } from '../../utils/urlConfing';
import { FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TotalDevelopers = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDeveloper, setEditDeveloper] = useState(null);
  const [updating, setUpdating] = useState(false);

  const userName = sessionStorage.getItem('name');

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get(`${backend_url}/api/getDeveloper-data`, {
          headers: { Authorization: `${token}` },
        });
        setDevelopers(res.data.data || []);
      } catch (error) {
        console.error('Error fetching developers:', error);
        toast.error('Failed to load developers');
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this developer?')) return;

    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.delete(`${backend_url}/api/delete-developer/${id}`, {
        headers: { Authorization: `${token}` },
      });
      toast.success(res.data.message || 'Developer deleted successfully!');
      setDevelopers(developers.filter((d) => d.id !== id));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete developer');
    }
  };

  // Open edit card
  const handleEdit = (developer) => setEditDeveloper(developer);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditDeveloper({ ...editDeveloper, [name]: value });
  };

  // Update developer
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = sessionStorage.getItem('token');
      const { id, name, email, phone, password } = editDeveloper;

      const res = await axios.put(
        `${backend_url}/api/edit-developer/${id}`,
        { name, email, phone, password },
        { headers: { Authorization: `${token}` } }
      );

      toast.success(res.data.message || 'Developer updated successfully!');
      setDevelopers(
        developers.map((d) =>
          d.id === id ? { ...d, name, email, phone } : d
        )
      );
      setEditDeveloper(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update developer');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-10">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 sm:mb-0">
          Project Management
        </h1>
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-4xl text-gray-600 cursor-pointer hover:text-blue-600 transition" />
          <p className="font-medium">{userName}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Developer Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Developers</h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading developers...</p>
          ) : developers.length === 0 ? (
            <p className="text-center text-gray-600">No developers found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Phone</th>
                  <th className="py-2 px-4 text-center">Total Projects</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-medium">
                {developers.map((dev) => (
                  <tr
                    key={dev.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-4">{dev.name}</td>
                    <td className="py-2 px-4">{dev.email}</td>
                    <td className="py-2 px-4">{dev.phone}</td>
                    <td className="py-2 px-4 text-center">{dev.total_projects}</td>
                    <td className="py-2 px-4 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(dev)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(dev.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Card */}
        {editDeveloper && (
          <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Edit Developer</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editDeveloper.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editDeveloper.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editDeveloper.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={editDeveloper.password || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Leave blank to keep unchanged"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditDeveloper(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className={`px-4 py-2 rounded-lg text-white ${
                    updating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } transition`}
                >
                  {updating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalDevelopers;
