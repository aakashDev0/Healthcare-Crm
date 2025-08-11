import { AlertTriangle, Clock, Tag } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskDetailsModal from "../../Tasks/TaskDetailsModal";

const Tasks = () => {
  const [patientTasks, setPatientTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  // Add state for modal
  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    taskId: null,
    taskData: null
  });

  useEffect(() => {
    const fetchPatientAndTasks = async () => {
      setIsLoading(true);
      try {
        // Get patient ID from localStorage (same as in Overview.jsx)
        const patientId = localStorage.getItem("patientId");
        
        if (patientId) {
          // Fetch patient details
          const patientResponse = await axios.get(`http://localhost:8080/api/patients/${patientId}`);
          setPatient(patientResponse.data);
          
          // Fetch all tasks
          const tasksResponse = await axios.get("http://localhost:8080/api/tasks/getAllTasks");
          
          // Filter tasks for this patient
          const filteredTasks = tasksResponse.data.filter(
            task => task.patientId === parseInt(patientId)
          );
          
          setPatientTasks(filteredTasks);
        }
      } catch (error) {
        console.error("Error fetching patient tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientAndTasks();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Add the view task details handler
  const handleViewDetailsClick = async (taskId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8080/api/tasks/${taskId}`);
      if (response.data) {
        const task = response.data;
        
        // Format date for display
        const dueDate = new Date(task.dueDate);
        const formattedDueDate = dueDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        // Set task details
        const taskDetails = {
          id: task.id,
          title: task.title,
          description: task.description || "",
          priority: task.priority === "LOW" ? "Low" : task.priority === "MEDIUM" ? "Medium" : "High",
          status: task.status === "OPEN" ? "Open" : task.status === "IN_PROGRESS" ? "In Progress" : "Completed",
          dueDate: formattedDueDate,
          patient: patient?.fullName || `Patient ID: ${task.patientId}`,
          patientId: task.patientId,
          assignee: `Doctor ID: ${task.assigneeId}`, // You can fetch doctor details if needed
          assigneeId: task.assigneeId,
          caseId: `CASE-${task.id}`,
          createdAt: new Date(task.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          updatedAt: new Date(task.updatedAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        
        // Show details modal
        setModalState({
          type: 'view',
          isOpen: true,
          taskId: taskId,
          taskData: taskDetails
        });
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add handler for closing the modal
  const handleCloseModal = () => {
    setModalState({
      type: null,
      isOpen: false,
      taskId: null,
      taskData: null
    });
  };

  // Add handler for edit button in modal
  const handleEditClick = (taskId) => {
    // You can implement edit functionality here if needed
    console.log("Edit task:", taskId);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-700">
              Patient Tasks
            </h1>
            <p className="text-gray-500 text-sm">
              All tasks associated with {patient?.fullName || "this patient"}
            </p>
          </div>
         
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>
        ) : patientTasks.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No tasks found for this patient.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            {patientTasks.map((task) => (
              <div key={task.id} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div className="flex items-center mb-2">
                      <h2 className="text-lg font-medium text-gray-700 mr-3">
                        {task.title}
                      </h2>
                      <span className={`text-white text-xs px-2 py-1 rounded ${
                        task.status === "COMPLETED" 
                          ? "bg-green-500" 
                          : task.status === "IN_PROGRESS" 
                          ? "bg-indigo-500" 
                          : "bg-blue-500"
                      }`}>
                        {task.status}
                      </span>
                      {task.priority === "HIGH" && (
                        <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          High Priority
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                    )}
                    <p className="text-gray-500 text-sm flex items-center">
                      <Tag size={16} className="mr-2 text-gray-400" /> 
                      Patient: {patient?.fullName}
                    </p>
                    {task.dueDate && (
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Clock size={16} className="mr-1" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 md:mt-0 flex items-center">
                    <span className="text-gray-500 mr-4">
                      {new Date(task.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </span>
                    <button 
                      onClick={() => handleViewDetailsClick(task.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Details Modal */}
      
      
      <TaskDetailsModal 
        isOpen={modalState.isOpen && modalState.type === 'view'} 
        onClose={handleCloseModal}
        taskDetails={modalState.taskData}
        onEditClick={null}
      />
    </div>
  );
};

export default Tasks;
