import React, { useState, useEffect, useMemo } from "react";
import { useApi } from "../../../Services/Api";
import { Search, UserPlus, Edit, Filter, ChevronDown, ChevronUp, Save, X, User, Briefcase, Shield } from "lucide-react";

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);

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
      setShowMobileForm(false);
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
      setExpandedUser(null);
      fetchUsers();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to update user.";
      alert(message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const startEditing = (user) => {
    setEditingUser({ ...user, password: "" });
    setExpandedUser(user._id);
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case "Admin": return <Shield className="h-4 w-4" />;
      case "Seller": return <Briefcase className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case "Admin": return "bg-red-100 text-red-800 border-red-200";
      case "Seller": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading users...</p>
      </div>
    </div>
  );

  if (error)
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Error: {error}</span>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Manage user accounts and permissions
            </p>
          </div>
          
          {/* Mobile Add Button */}
          <button
            onClick={() => setShowMobileForm(!showMobileForm)}
            className="md:hidden mt-4 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            {showMobileForm ? "Cancel" : "Add User"}
          </button>
        </div>

      

        {/* Add User Form */}
        <div className={`${showMobileForm ? 'block' : 'hidden md:block'} mb-6 md:mb-8`}>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 flex items-center">
              <UserPlus className="mr-2 h-5 w-5 text-indigo-600" />
              Create New User
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base bg-white"
                  >
                    <option value="User">User</option>
                    <option value="Seller">Seller</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                <div className="lg:col-span-1 flex items-end">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 md:py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm md:text-base"
                  >
                    Add User
                  </button>
                </div>
              </div>
              {formError && (
                <p className="text-red-500 text-sm mt-2 px-1">{formError}</p>
              )}
            </form>
          </div>
        </div>

        {/* Search and Filter - Mobile Toggle */}
        <div className="mb-4 md:mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm mb-3"
          >
            <span className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-gray-400" />
              {searchTerm ? `Search: "${searchTerm}"` : "Search & Filter Users"}
            </span>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className={`${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>
                <div className="w-full md:w-48">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base bg-white"
                  >
                    <option value="All">All Roles</option>
                    <option value="User">Users</option>
                    <option value="Seller">Sellers</option>
                    <option value="Admin">Admins</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users List - Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-gray-400 mb-2">
                <User className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Users Found</h3>
              <p className="text-gray-500">
                {searchTerm || filterRole !== "All" 
                  ? "Try adjusting your search or filter" 
                  : "Start by adding your first user"}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                {editingUser && editingUser._id === user._id ? (
                  <div className="p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                          type="password"
                          placeholder="Leave blank to keep current"
                          value={editingUser.password}
                          onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                        >
                          <option value="User">User</option>
                          <option value="Seller">Seller</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => handleUpdateUser(user._id)}
                          className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center justify-center"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingUser(null); setExpandedUser(null); }}
                          className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 flex items-center justify-center"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className={`p-2 rounded-lg ${getRoleColor(user.role).split(' ')[0]} mr-3`}>
                              {getRoleIcon(user.role)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{user.name}</h3>
                              <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mt-2"
                          >
                            {expandedUser === user._id ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                Show Details
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)} mb-2`}>
                            {user.role}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEditing(user)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {expandedUser === user._id && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</p>
                              <p className="text-sm text-gray-700 truncate">{user._id}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Created</p>
                              <p className="text-sm text-gray-700">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(user)}
                              className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 flex items-center justify-center"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit User
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 flex items-center justify-center"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    {editingUser && editingUser._id === user._id ? (
                      <>
                        <td className="py-4 px-4 md:px-6">
                          <input
                            type="text"
                            value={editingUser.name}
                            onChange={(e) =>
                              setEditingUser({ ...editingUser, name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <input
                            type="email"
                            value={editingUser.email}
                            onChange={(e) =>
                              setEditingUser({ ...editingUser, email: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <select
                            value={editingUser.role}
                            onChange={(e) =>
                              setEditingUser({ ...editingUser, role: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="User">User</option>
                            <option value="Seller">Seller</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <div className="flex flex-col">
                            <input
                              type="password"
                              placeholder="New password (optional)"
                              value={editingUser.password}
                              onChange={(e) =>
                                setEditingUser({ ...editingUser, password: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4 md:px-6 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateUser(user._id)}
                              className="px-3 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="px-3 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 flex items-center"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4 md:px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-indigo-800 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {user._id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${getRoleColor(user.role).split(' ')[0]} mr-2`}>
                              {getRoleIcon(user.role)}
                            </div>
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}
                            >
                              {user.role}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <div className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4 md:px-6 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(user)}
                              className="px-3 py-2 bg-indigo-100 text-indigo-700 text-sm rounded-md hover:bg-indigo-200 flex items-center transition duration-150"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="px-3 py-2 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 flex items-center transition duration-150"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="text-gray-400 mb-2">
                        <User className="w-12 h-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Users Found</h3>
                      <p className="text-gray-500">
                        {searchTerm || filterRole !== "All" 
                          ? "Try adjusting your search or filter" 
                          : "Start by adding your first user"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Info */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 md:mt-6 flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-500">
            <div className="mb-2 md:mb-0">
              Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> users
            </div>
            <div className="flex items-center space-x-2">
              <span>Filtered by:</span>
              {filterRole !== "All" && (
                <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(filterRole)}`}>
                  {filterRole}
                </span>
              )}
              {searchTerm && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  Search: "{searchTerm}"
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;