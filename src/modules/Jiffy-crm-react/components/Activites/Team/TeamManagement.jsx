import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Filter, Users, ChevronUp, ChevronDown, X, PlusCircle, User } from 'lucide-react';
import axios from 'axios';
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TeamManagement = () => {
    const [doctorsData, setDoctorsData] = useState([]);
    const [doctorSearchText, setDoctorSearchText] = useState('');
    const [teamMemberSearchText, setTeamMemberSearchText] = useState('');
    const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
    const [showTeamMemberDropdown, setShowTeamMemberDropdown] = useState(false);
    
    // Fetch doctors from API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/doctors/all');
                if (response.data && Array.isArray(response.data)) {
                    setDoctorsData(response.data);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                toast.error("Failed to load doctors. Please try again.");
            }
        };
        
        fetchDoctors();
    }, []);

    // Initialize teams state with empty array instead of sample data
    const [teams, setTeams] = useState([]);
   
    const departments = ["Cardiology", "Neurology", "Pediatrics", "Oncology", "Surgery", "Radiology", "Orthopedics"];
    
    const [searchText, setSearchText] = useState('');
    const [filterBy, setFilterBy] = useState('name');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [showAddModal, setShowAddModal] = useState(false);
    
    const [formData, setFormData] = useState({
        teamName: '',
        department: '',
        leadDoctor: '',
        doctorId: '', 
        teamMembers: []
    });
    
    // Filter doctors based on search text
    const filteredDoctors = doctorsData.filter(doctor => {
        if (!doctorSearchText) return true;
        const searchLower = doctorSearchText.toLowerCase();
        return (
            (doctor.fullName && doctor.fullName.toLowerCase().includes(searchLower)) ||
            (doctor.specialization && doctor.specialization.toLowerCase().includes(searchLower))
        );
    });
    
    // Fetch teams from API
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/teams/getAllTeams');
                if (response.data && Array.isArray(response.data)) {
                    // Map the backend response to our frontend team structure
                    const mappedTeams = response.data.map(team => ({
                        id: team.id,
                        name: team.teamName,
                        department: team.department,
                        leadDoctor: team.leadDoctor ? team.leadDoctor.fullName : 'Not Assigned',
                        members: team.members ? team.members.length : 0,
                        status: team.status === 'ACTIVE' ? 'Active' : 'Inactive'
                    }));
                    setTeams(mappedTeams);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
                toast.error("Failed to load teams. Please try again.");
            }
        };
        
        fetchTeams();
    }, []);

    const filteredTeamMemberDoctors = doctorsData.filter(doctor => {
        if (doctor.doctorId && doctor.doctorId.toString() === formData.doctorId) return false;
        if (!teamMemberSearchText) return true;
        const searchLower = teamMemberSearchText.toLowerCase();
        return (
            (doctor.fullName && doctor.fullName.toLowerCase().includes(searchLower)) ||
            (doctor.specialization && doctor.specialization.toLowerCase().includes(searchLower))
        );
    });
    

    const [memberInput, setMemberInput] = useState('');
    
    const itemsPerPage = 5;
    
    
    const filteredTeams = teams.filter(team => {
        const searchLower = searchText.toLowerCase();
        if (!searchText) return true;
        
        if (filterBy === 'members') {
            return team.members.toString().includes(searchLower);
        }
        
        const fieldValue = team[filterBy] || '';
        return fieldValue.toString().toLowerCase().includes(searchLower);
    });
    

    const sortedTeams = [...filteredTeams].sort((a, b) => {
        if (!sortField) return 0;
        
        
        if (sortField === 'members') {
            if (sortDirection === 'asc') {
                return a.members - b.members;
            } else {
                return b.members - a.members;
            }
        }
        
        const aValue = String(a[sortField]).toLowerCase();
        const bValue = String(b[sortField]).toLowerCase();
        
        if (sortDirection === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });
    
   
    const totalPages = Math.ceil(sortedTeams.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTeams = sortedTeams.slice(startIndex, startIndex + itemsPerPage);
    
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    
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
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'doctorId') {
            const selectedDoctor = doctorsData.find(doc => doc.doctorId.toString() === value);
            if (selectedDoctor) {
                setFormData({
                    ...formData,
                    doctorId: value,
                    leadDoctor: selectedDoctor.fullName
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };
    
    const addTeamMember = () => {
        if (memberInput) {
            const selectedDoctor = doctorsData.find(doc => doc.doctorId.toString() === memberInput);
            if (selectedDoctor && !formData.teamMembers.some(m => m === selectedDoctor.fullName)) {
                setFormData({
                    ...formData,
                    teamMembers: [...formData.teamMembers, selectedDoctor.fullName]
                });
                setMemberInput('');
                setTeamMemberSearchText('');
            }
        }
    };
    
    const removeTeamMember = (member) => {
        setFormData({
            ...formData,
            teamMembers: formData.teamMembers.filter(m => m !== member)
        });
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Format the request body according to the API requirements
            const teamRequest = {
                teamName: formData.teamName,
                department: formData.department,
                leadDoctorId: parseInt(formData.doctorId),
                members: formData.teamMembers.map(member => {
                    // Find the doctor ID for each team member
                    const doctor = doctorsData.find(doc => doc.fullName === member);
                    return {
                        doctorId: doctor ? doctor.doctorId : 0
                    };
                }),
                status: "ACTIVE"
            };
            
            // Send the request to the backend
            const response = await axios.post('http://localhost:8080/api/teams/create', teamRequest);
            
            if (response.data) {
                // Show success toast
                toast.success("Team created successfully!");
                
                // Fetch updated teams list
                try {
                    const teamsResponse = await axios.get('http://localhost:8080/api/teams');
                    if (teamsResponse.data && Array.isArray(teamsResponse.data)) {
                        const mappedTeams = teamsResponse.data.map(team => ({
                            id: team.id,
                            name: team.teamName,
                            department: team.department,
                            leadDoctor: team.leadDoctor ? team.leadDoctor.fullName : 'Not Assigned',
                            members: team.members ? team.members.length : 0,
                            status: team.status === 'ACTIVE' ? 'Active' : 'Inactive'
                        }));
                        setTeams(mappedTeams);
                    }
                } catch (fetchError) {
                    console.error("Error fetching updated teams:", fetchError);
                }
            }
            
            // Reset form and close modal
            setFormData({
                teamName: '',
                department: '',
                leadDoctor: '',
                doctorId: '',
                teamMembers: []
            });
            setShowAddModal(false);
        } catch (error) {
            console.error("Error creating team:", error);
            toast.error("Failed to create team. Please try again.");
        }
    };
    

      
      const getDepartmentColorClass = (department) => {
        const colors = {
          'Cardiology': 'bg-blue-100 text-blue-800',
          'Neurology': 'bg-blue-100 text-blue-800',
          'Pediatrics': 'bg-green-100 text-green-800',
          'Oncology': 'bg-purple-100 text-purple-800',
          'Surgery': 'bg-orange-100 text-orange-800',
          'Radiology': 'bg-indigo-100 text-indigo-800',
          'Orthopedics': 'bg-red-100 text-red-800'
        };
        
        return colors[department] || 'bg-gray-100 text-gray-800';
      };
    
      return (
        <>
        <ToastContainer/>
        <div className="max-w-7xl mx-auto p-7 md:p-6">
          {/* {/ Breadcrumb /}   */}
          {/* <div className="flex items-center text-gray-500 mb-4">
            <button className="p-1 mr-2">
              <ChevronLeft size={16} />
            </button>
            <span>Team Management</span>
            <span className="text-gray-400 text-sm ml-2">/admin/teams</span>
          </div> */}
          
          {/* {/ Header /} */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
              <p className="text-gray-500">Manage emergency response teams</p>
            </div>
            <button 
              className="mt-4 md:mt-0 bg-[#4c744a] hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => setShowAddModal(true)}
            >
              <Users size={18} className="mr-2" />
              Add Team
            </button>
          </div>
          
          {/* {/ Search and Filter /} */}
          <div className="mb-6 flex flex-col md:flex-row">
            <div className="relative flex-grow mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search teams..." 
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
                  {['name', 'department', 'leadDoctor', 'members', 'status'].map((field) => (
                    <div key={field} className="flex items-center mb-1">
                      <input 
                        type="radio" 
                        id={field} 
                        name="filterBy" 
                        checked={filterBy === field}
                        onChange={() => setFilterBy(field)}
                        className="mr-2"
                      />
                      <label htmlFor={field} className="capitalize text-gray-700">
                        {field === 'name' ? 'Team Name' : 
                         field === 'leadDoctor' ? 'Lead Doctor' : field}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* {/ Table /} */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    { id: 'name', label: 'Team Name' },
                    { id: 'department', label: 'Department' },
                    { id: 'leadDoctor', label: 'Lead Doctor' },
                    { id: 'members', label: 'Members' },
                    { id: 'status', label: 'Status' },
                    { id: 'actions', label: 'Actions' }
                  ].map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      <div 
                        className={`flex items-center ${header.id !== 'actions' ? 'cursor-pointer' : ''}`}
                        onClick={() => header.id !== 'actions' && handleSort(header.id)}
                      >
                        <span>{header.label}</span>
                        {sortField === header.id && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">{team.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDepartmentColorClass(team.department)}`}>
                        {team.department}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{team.leadDoctor}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-700">{team.members}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        team.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {team.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      <button>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* {/ Pagination /} */}
          {totalPages > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTeams.length)} of {sortedTeams.length} teams
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
          
          {/* Add Team Modal */}
          {showAddModal && (
            // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Add New Team</h3>
                  <button 
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowAddModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="overflow-y-auto px-6 py-4 flex-grow">
                  <form onSubmit={handleSubmit}>
                    {/* Team Name */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                      <input
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    {/* Department */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Lead Doctor */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lead Doctor</label>
                      <div className="relative doctor-dropdown-container">
                        <div className="flex items-center mb-2">
                          <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="Search doctors..."
                              value={doctorSearchText}
                              onChange={(e) => setDoctorSearchText(e.target.value)}
                              onFocus={() => setShowDoctorDropdown(true)}
                              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        
                        {formData.leadDoctor ? (
                          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-300">
                            <div className="flex items-center">
                              <User size={18} className="text-gray-500 mr-2" />
                              <span className="text-gray-700">{formData.leadDoctor}</span>
                              {formData.doctorId && doctorsData.find(d => d.doctorId.toString() === formData.doctorId)?.specialization && (
                                <span className="text-gray-500 text-sm ml-2">
                                  - {doctorsData.find(d => d.doctorId.toString() === formData.doctorId).specialization}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  leadDoctor: '',
                                  doctorId: ''
                                });
                                setDoctorSearchText('');
                                setShowDoctorDropdown(false);
                              }}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          showDoctorDropdown && (
                            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md">
                              {filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doctor) => (
                                  <div 
                                    key={doctor.doctorId} 
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                    onClick={() => {
                                      setFormData({
                                        ...formData,
                                        doctorId: doctor.doctorId.toString(),
                                        leadDoctor: doctor.fullName
                                      });
                                      setDoctorSearchText('');
                                      setShowDoctorDropdown(false);
                                    }}
                                  >
                                    <div className="flex items-center">
                                      <User size={16} className="text-gray-500 mr-2" />
                                      <div>
                                        <div className="text-sm font-medium">{doctor.fullName}</div>
                                        {doctor.specialization && (
                                          <div className="text-xs text-gray-500">{doctor.specialization}</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-gray-500 text-center">
                                  {doctorSearchText ? 'No doctors found' : 'No doctors available'}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    
                    {/* Team Members */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
                      <div className="relative team-member-dropdown-container">
                        <div className="relative mb-2">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search team members..."
                            value={teamMemberSearchText}
                            onChange={(e) => setTeamMemberSearchText(e.target.value)}
                            onFocus={() => setShowTeamMemberDropdown(true)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        {showTeamMemberDropdown && (
                          <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md mb-3">
                            {filteredTeamMemberDoctors
                              .filter(doctor => !formData.teamMembers.includes(doctor.fullName))
                              .length > 0 ? (
                                filteredTeamMemberDoctors
                                  .filter(doctor => !formData.teamMembers.includes(doctor.fullName))
                                  .map((doctor) => (
                                    <div 
                                      key={doctor.doctorId} 
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                      onClick={() => {
                                        if (!formData.teamMembers.includes(doctor.fullName)) {
                                          setFormData({
                                            ...formData,
                                            teamMembers: [...formData.teamMembers, doctor.fullName]
                                          });
                                          setTeamMemberSearchText('');
                                          setShowTeamMemberDropdown(false);
                                        }
                                      }}
                                    >
                                      <div className="flex items-center">
                                        <User size={16} className="text-gray-500 mr-2" />
                                        <div>
                                          <div className="text-sm font-medium">{doctor.fullName}</div>
                                          {doctor.specialization && (
                                            <div className="text-xs text-gray-500">{doctor.specialization}</div>
                                          )}
                                        </div>
                                      </div>
                                      <PlusCircle size={16} className="text-blue-500" />
                                    </div>
                                  ))
                              ) : (
                                <div className="px-3 py-2 text-gray-500 text-center">
                                  {teamMemberSearchText ? 'No doctors found' : 'No available doctors'}
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                      
                      {/* Display added members */}
                      <div className="max-h-32 overflow-y-auto">
                        {formData.teamMembers.length > 0 ? (
                          formData.teamMembers.map((member, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 mb-1 rounded border border-gray-200">
                              <div className="flex items-center">
                                <User size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">{member}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeTeamMember(member)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 text-sm py-2">
                            No team members added yet
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => setShowAddModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#4c744a] hover:bg-green-700 text-white rounded-md"
                      >
                        Add Team
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
      );
    };  
        
export default TeamManagement