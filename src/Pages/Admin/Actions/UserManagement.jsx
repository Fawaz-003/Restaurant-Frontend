import React, { useState, useEffect, useMemo } from "react";
import { useApi } from "../../../Services/Api";
import { Search, UserPlus, Edit } from "lucide-react";

const UserManagement = () => {
  const api = useApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [formError, setFormError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getAllUsers();
      setUsers(response.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      setFormError("All fields are required.");
      return;
    }
    try {
      await api.adminCreateUser(newUser);
      setNewUser({ name: "", email: "", password: "", role: "User" });
      setFormError("");
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    }
  };

  const handleUpdateUser = async (id) => {
    if (!editingUser || !editingUser.name || !editingUser.email || !editingUser.role) {
      alert("Name, email, and role are required.");
      return;
    }
    
    try {
      await api.updateUser(id, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to update user.";
      alert(message);
    }
  };

  const startEditing = (user) => {
    setEditingUser({ ...user, password: "" }); // Clear password for security
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        if (filterRole === "All") return true;
        return user.role === filterRole;
      })
      .filter((user) => {
        if (!searchTerm) return true;
        return (
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  }, [users, searchTerm, filterRole]);

  if (loading) return <div className="text-center p-4">Loading users...</div>;
  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">User Management</h2>

      {/* Add User Form */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
          <UserPlus className="mr-2 h-6 w-6 text-indigo-600" /> Create New User
        </h3>
        <form
          onSubmit={handleCreateUser}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="User">User</option>
            <option value="Seller">Seller</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Add User
          </button>
        </form>
        {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
      </div>

      {/* Search and Filter */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-md flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Roles</option>
          <option value="User">Users</option>
          <option value="Seller">Sellers</option>
          <option value="Admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                {editingUser && editingUser._id === user._id ? (
                  <>
                    <td className="py-4 px-6">
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            role: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      >
                        <option value="User">User</option>
                        <option value="Seller">Seller</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleUpdateUser(user._id)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "Admin"
                            ? "bg-red-100 text-red-800"
                            : user.role === "Seller"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium">
                      <button
                        onClick={() => startEditing(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
