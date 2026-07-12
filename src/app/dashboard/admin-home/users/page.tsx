"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axiosInstance
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleRoleChange = async (email: string, newRole: string) => {
    try {
      await axiosInstance.put(`/users/${email}`, { role: newRole });
      toast.success("Role updated!");
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  const handleDelete = async (email: string, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      await axiosInstance.delete(`/users/${email}`);
      toast.success("User deleted.");
      setUsers((prev) => prev.filter((u) => u.email !== email));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-peyara-dark mb-6">Manage Users</h1>

      <div className="bg-white rounded-xl border border-peyara-accent p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-peyara-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-peyara-accent">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Name</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Role</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Credits</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-peyara-accent/50 hover:bg-peyara-bg/50">
                    <td className="py-3 px-2 font-medium text-peyara-dark">
                      <div className="flex items-center gap-2">
                        {u.photo ? (
                          <img src={u.photo} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-peyara-primary flex items-center justify-center text-white text-xs font-bold">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {u.name}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{u.email}</td>
                    <td className="py-3 px-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.email, e.target.value)}
                        className="px-2 py-1 border border-peyara-accent rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-peyara-primary bg-peyara-bg/50"
                      >
                        <option value="supporter">Supporter</option>
                        <option value="creator">Creator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{u.credits}</td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleDelete(u.email, u.name)}
                        className="p-1.5 text-peyara-secondary hover:opacity-70 transition"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No users found.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
