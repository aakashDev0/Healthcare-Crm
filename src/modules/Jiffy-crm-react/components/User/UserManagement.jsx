import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, setLoading, setError } from '../redux/slices/userSlice';
import axios from "axios";
import { Search, UserPlus, Pencil, Trash2, ChevronDown, ChevronLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleDropdown, setRoleDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const usersPerPage = 7;

  const roles = [
    { name: "ROLE", id: 0 }, // Default option
    { name: "ADMINISTRATION", category: "SYSTEM", id: 1 },
    { name: "SITE_ADMIN", category: "USER", id: 2 },
    { name: "ROOT_USER", category: "USER", id: 3 },
    { name: "DOCTOR", category: "USER", id: 4 },
    { name: "MARKETING", category: "USER", id: 5 }
  ];
  const statuses = ["STATUS", "ACTIVE", "INACTIVE"];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedRole && selectedRole !== "ROLE") {
      filtered = filtered.filter((user) => user.userCategory === selectedRole);
    }

    if (selectedStatus && selectedStatus !== "STATUS") {
      filtered = filtered.filter((user) => user.userStatus === selectedStatus);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedStatus, users]);

  const fetchUsers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get("http://localhost:8080/api/users/all");
      console.log(response.data);
      dispatch(setUsers(response.data));
      setFilteredUsers(response.data);
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const toggleUserStatus = async () => {
    if (!selectedUser) return;
    try {
      const response = await axios.put(
        "http://localhost:8080/auth/toggleUserStatus",
        {
          email: selectedUser.email,
        }
      );

      if (response.status === 200) {
        dispatch(setUsers(users.map((user) =>
          user.email === selectedUser.email
            ? {
                ...user,
                userStatus:
                  user.userStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE",
              }
            : user
        )));
        setShowPopup(false);
        setConfirmationMessage(`User status changed successfully`);
        setTimeout(() => setConfirmationMessage(""), 3000);
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      <ToastContainer />
      <div className="max-w-7xl mx-auto p-7">
        {/* Breadcrumb */}
        {/* <div className="flex justify-between text-gray-500 mb-4">
          <div>
          <button className="p-1 mr-2">
            <ChevronLeft size={16} />
          </button>
          <span>User Management</span>
          <span className="text-gray-400 text-sm ml-2">/admin/users</span>
          </div>
          <div className="flex gap-x-4">
            <button className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition-colors">Doctor Management</button>
          <button className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition-colors">Team Management</button>
          </div>
        </div> */}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              User Management
            </h1>
            <p className="text-gray-500">
              Manage user profiles and access control
            </p>
          </div>
          <button
            onClick={() => navigate("/inviteuser")}
            className="mt-4 md:mt-0 bg-[#4c744a] hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <UserPlus size={18} className="mr-2" />
            Invite User
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row">
          <div className="relative flex-grow mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4 ml-0 md:ml-4">
            <div className="relative">
              <button
                onClick={() => setRoleDropdown(!roleDropdown)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center"
              >
                <Filter size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-700">{selectedRole || "Role"}</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
              {roleDropdown && (
  <ul className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
    {roles.map((role) => (
      <li
        key={role.name}
        onClick={() => {
          setSelectedRole(role.name);
          setRoleDropdown(false);
        }}
        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
      >
        {role.name.replace('_', ' ')}
      </li>
    ))}
  </ul>
)}
            </div>
            <div className="relative">
              <button
                onClick={() => setStatusDropdown(!statusDropdown)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center"
              >
                <Filter size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-700">{selectedStatus || "Status"}</span>
                <ChevronDown size={16} className="ml-2" />
              </button>
              {statusDropdown && (
                <ul className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {statuses.map((status) => (
                    <li
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setStatusDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      {status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50 text-sm text-gray-500">
                <th className="px-6 py-3 text-left font-medium">User ID</th>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Role</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50 text-sm">
                    <td className="px-6 py-4">USER-{user.userId}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    
                    {/* // Update the role display in the table */}
                    <td className="px-6 py-4">
  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
    {roles.find(r => r.id === user.roleId)?.name.replace('_', ' ') || user.userCategory}
  </span>
</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.userStatus === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {user.userStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate("/edituser", { state: { user } })}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowPopup(true);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between border-t border-gray-200 text-sm text-gray-500">
          <div>
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-blue-50 text-blue-600">
              {currentPage}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Status Change Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-medium mb-4">Confirm Status Change</h3>
            <p className="mb-6">
              Are you sure you want to change the status of {selectedUser.name}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={toggleUserStatus}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {confirmationMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg">
          {confirmationMessage}
        </div>
      )}
    </>
  );
};

export default UserManagement;