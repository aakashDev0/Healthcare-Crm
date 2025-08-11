import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserPlus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import DoctorForm from "./DoctorForm";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const DoctorManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [editDoctorData, setEditDoctorData] = useState(null);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/doctors/all");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-800"></div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center p-10">Loading doctors...</div>;
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const itemsPerPage = 5;
  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchText.toLowerCase();
    if (!searchText) return true;

    return doctor[filterBy].toLowerCase().includes(searchLower);
  });
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField].toLowerCase();
    const bValue = b[sortField].toLowerCase();
    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
  const totalPages = Math.ceil(sortedDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoctors = sortedDoctors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getDepartmentColorClass = (department) => {
    const colors = {
      CARDIOLOGY: "bg-blue-100 text-blue-800",
      NEUROLOGY: "bg-blue-200 text-blue-900",
      PEDIATIRICS: "bg-green-100 text-green-800",
      ONCOLOGY: "bg-purple-100 text-purple-800",
      SURGERY: "bg-orange-100 text-orange-800",
    };
    return colors[department] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-7xl mx-auto p-7">
        {/* <div className="flex items-center text-gray-500 mb-4">
          <button className="p-1 mr-2">
            <ChevronLeft size={16} />
          </button>
          <span>Doctor Management</span>
          <span className="text-gray-400 text-sm ml-2">/admin/doctors</span>
        </div> */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Doctor Management
            </h1>
            <p className="text-gray-500">
              Manage doctor profiles and privileges
            </p>
          </div>
          <button
            className="mt-4 md:mt-0 bg-[#4c744a]  hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => {
              setShowAddModal(true);
              setEditDoctorData(null);
            }}
          >
            <UserPlus size={18} className="mr-2" />
            Add Doctor
          </button>
        </div>
        <div className="mb-6 flex flex-col md:flex-row">
          <div className="relative flex-grow mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search doctors..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="relative ml-0 md:ml-4">
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2 text-gray-500" />
              <span className="text-gray-700">Filters</span>
            </button>

            {showFilters && (
              <div className="absolute mt-2 p-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="text-sm font-medium mb-2">Filter by:</div>
                {["name", "specialization", "department", "email", "phone"].map(
                  (field) => (
                    <div key={field} className="flex items-center mb-1">
                      <input
                        type="radio"
                        id={field}
                        name="filterBy"
                        checked={filterBy === field}
                        onChange={() => setFilterBy(field)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={field}
                        className="capitalize text-gray-700"
                      >
                        {field}
                      </label>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "name",
                  "specialization",
                  "department",
                  "email",
                  "phone",
                  "status",
                  "actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => header !== "actions" && handleSort(header)}
                    >
                      <span className="capitalize">{header}</span>
                      {sortField === header && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700">
                      {doctor.fullName}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {doctor.specialization}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDepartmentColorClass(
                        doctor.department
                      )}`}
                    >
                      {doctor.department}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{doctor.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {doctor.phoneNumber}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doctor.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : doctor.status === "INACTIVE"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {doctor.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td
                    onClick={() => {
                      setEditDoctorData(doctor);
                      setShowAddModal(true);
                    }}
                    className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium"
                  >
                    <button>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <DoctorForm
            setShowAddModal={setShowAddModal}
            ToastContainer={ToastContainer}
            fetchDoctors={fetchDoctors}
            editData={editDoctorData}
          />
        )}
        {totalPages > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, sortedDoctors.length)} of{" "}
              {sortedDoctors.length} doctors
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorManagement;
