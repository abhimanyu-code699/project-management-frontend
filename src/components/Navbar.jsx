import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import axios from "axios";
import { backend_url } from "../../utils/urlConfing";

const Navbar = ({ developerId }) => {
  const [user, setUser] = useState({ name: "Developer" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = sessionStorage.getItem("token");
      if (!developerId) return;

      try {
        const response = await axios.get(`${backend_url}/api/developer/${developerId}`, {
          headers: { Authorization: token },
        });
        setUser(response.data?.data || { name: "Developer" });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [developerId]);

  return (
    <div className="flex justify-between items-center mb-8 bg-white px-6 py-4 shadow rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>

      <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
        <User className="w-6 h-6 text-gray-600" />
        <span className="font-medium text-gray-800">{user.name}</span>
      </div>
    </div>
  );
};

export default Navbar;
