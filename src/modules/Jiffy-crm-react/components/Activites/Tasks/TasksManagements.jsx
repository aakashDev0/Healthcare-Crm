import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import components
import TaskItem from "./TaskItem";
import CreateEditTaskModal from "./CreateEditTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";

const TasksManagements = () => {
  // State for UI
  const [activeTab, setActiveTab] = useState("myTasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [sortBy, setSortBy] = useState("Due Date");
  const [isLoading, setIsLoading] = useState(false);

  // State for data
  const [tasksData, setTasksData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);

  // State for modals
  const [modalState, setModalState] = useState({
    type: null, // 'create', 'edit', 'view'
    isOpen: false,
    taskId: null,
    taskData: null,
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/tasks/getAllTasks"
      );
      if (response.data && Array.isArray(response.data)) {
        setTasksData(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchTasks();

    // Fetch patients
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/patients/all"
        );
        if (response.data && Array.isArray(response.data)) {
          setPatientsData(response.data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients. Please try again.");
      }
    };

    // Fetch doctors
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/doctors/all"
        );
        if (response.data && Array.isArray(response.data)) {
          setDoctorsData(response.data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors. Please try again.");
      }
    };

    fetchPatients();
    fetchDoctors();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Get filtered and sorted task list
  const getTaskList = () => {
    const filteredTasks = tasksData.filter((task) => {
      const isMyTask = task.taskType === "MY_TASK";
      const isTeamTask = task.taskType === "TEAM_TASK";

      // Filter by tab
      if (activeTab === "myTasks" && !isMyTask) return false;
      if (activeTab === "teamTasks" && !isTeamTask) return false;

      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        (task.title &&
          task.title.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filter by status
      const taskStatus =
        task.status === "OPEN"
          ? "Open"
          : task.status === "IN_PROGRESS"
          ? "In Progress"
          : task.status === "COMPLETED"
          ? "Completed"
          : "";
      const matchesStatus =
        statusFilter === "All Statuses" || taskStatus === statusFilter;

      // Filter by priority
      const taskPriority =
        task.priority === "LOW"
          ? "Low"
          : task.priority === "MEDIUM"
          ? "Medium"
          : task.priority === "HIGH"
          ? "High"
          : "";
      const matchesPriority =
        priorityFilter === "All Priorities" || taskPriority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Map tasks to display format
    const mappedTasks = filteredTasks.map((task) => {
      // Find patient and assignee details
      const patient =
        patientsData.find((p) => p.patientId === task.patientId) || {};
      const assignee =
        doctorsData.find((d) => d.doctorId === task.assigneeId) || {};

      // Format date
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let formattedDueDate;
      if (dueDate.toDateString() === today.toDateString()) {
        formattedDueDate = `Today, ${dueDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else if (dueDate.toDateString() === tomorrow.toDateString()) {
        formattedDueDate = `Tomorrow, ${dueDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else if (dueDate < today) {
        formattedDueDate = `Yesterday, ${dueDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else {
        formattedDueDate = `${dueDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}, ${dueDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      }

      return {
        id: task.id,
        title: task.title,
        description: task.description,
        patient: patient.fullName || `Patient ID: ${task.patientId}`,
        caseId: `CASE-${task.id}`,
        assignedTo: assignee.fullName || `Doctor ID: ${task.assigneeId}`,
        dueDate: formattedDueDate,
        dueDateRaw: dueDate, // For sorting
        priority:
          task.priority === "LOW"
            ? "Low"
            : task.priority === "MEDIUM"
            ? "Medium"
            : "High",
        priorityRank:
          task.priority === "HIGH" ? 3 : task.priority === "MEDIUM" ? 2 : 1, // For sorting
        status:
          task.status === "OPEN"
            ? "Open"
            : task.status === "IN_PROGRESS"
            ? "In Progress"
            : "Completed",
        statusRank:
          task.status === "COMPLETED"
            ? 3
            : task.status === "IN_PROGRESS"
            ? 2
            : 1, // For sorting
      };
    });

    // Sort tasks based on sortBy
    return mappedTasks.sort((a, b) => {
      switch (sortBy) {
        case "Due Date":
          return a.dueDateRaw - b.dueDateRaw;
        case "Priority":
          return b.priorityRank - a.priorityRank; // High to Low
        case "Status":
          return a.statusRank - b.statusRank; // Open to Completed
        case "Title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  // Handle task status change
  const handleTaskStatusChange = async (taskId, currentStatus) => {
    try {
      setIsLoading(true);
      // Determine the new status (toggle between Completed and Open)
      const newStatus = currentStatus === "Completed" ? "OPEN" : "COMPLETED";

      // Get the current task data
      const task = tasksData.find((t) => t.id === taskId);
      if (!task) return;

      // Prepare the updated task data
      const taskData = {
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: newStatus,
        dueDate: task.dueDate,
        patientId: task.patientId,
        assigneeId: task.assigneeId,
        taskType: task.taskType,
      };

      // Update the task in the backend
      await axios.put(`http://localhost:8080/api/tasks/${taskId}`, taskData);

      // Refresh the task list
      fetchTasks();

      // Show success message
      toast.success(
        `Task marked as ${newStatus === "COMPLETED" ? "completed" : "open"}`
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = async (taskId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/tasks/${taskId}`
      );
      if (response.data) {
        const task = response.data;

        // Find patient and assignee details
        const patient =
          patientsData.find((p) => p.patientId === task.patientId) || {};
        const assignee =
          doctorsData.find((d) => d.doctorId === task.assigneeId) || {};

        // Format date for datetime-local input
        const dueDate = new Date(task.dueDate);
        const formattedDueDate = dueDate.toISOString().slice(0, 16);

        // Set form data
        const formData = {
          id: task.id,
          title: task.title,
          description: task.description || "",
          priority:
            task.priority === "LOW"
              ? "Low"
              : task.priority === "MEDIUM"
              ? "Medium"
              : "High",
          status:
            task.status === "OPEN"
              ? "Open"
              : task.status === "IN_PROGRESS"
              ? "In Progress"
              : "Completed",
          dueDate: formattedDueDate,
          patient: patient.fullName || "",
          patientId: task.patientId,
          assignee: assignee.fullName || "",
          assigneeId: task.assigneeId,
          taskType: task.taskType,
        };

        // Open edit modal
        setModalState({
          type: "edit",
          isOpen: true,
          taskId: taskId,
          taskData: formData,
        });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to load task details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view details button click
  const handleViewDetailsClick = async (taskId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/tasks/${taskId}`
      );
      if (response.data) {
        const task = response.data;

        // Find patient and assignee details
        const patient =
          patientsData.find((p) => p.patientId === task.patientId) || {};
        const assignee =
          doctorsData.find((d) => d.doctorId === task.assigneeId) || {};

        // Format date for display
        const dueDate = new Date(task.dueDate);
        const formattedDueDate = dueDate.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        // Set task details
        const taskDetails = {
          id: task.id,
          title: task.title,
          description: task.description || "",
          priority:
            task.priority === "LOW"
              ? "Low"
              : task.priority === "MEDIUM"
              ? "Medium"
              : "High",
          status:
            task.status === "OPEN"
              ? "Open"
              : task.status === "IN_PROGRESS"
              ? "In Progress"
              : "Completed",
          dueDate: formattedDueDate,
          patient: patient.fullName || `Patient ID: ${task.patientId}`,
          patientId: task.patientId,
          assignee: assignee.fullName || `Doctor ID: ${task.assigneeId}`,
          assigneeId: task.assigneeId,
          caseId: `CASE-${task.id}`,
          createdAt: new Date(task.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          updatedAt: new Date(task.updatedAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        // Show details modal
        setModalState({
          type: "view",
          isOpen: true,
          taskId: taskId,
          taskData: taskDetails,
        });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to load task details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle create/edit task submission
  const handleTaskSubmit = async (formData) => {
    try {
      setIsLoading(true);

      // Convert form data to API format
      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority.toUpperCase(),
        status: formData.status.replace(" ", "_").toUpperCase(),
        dueDate: formData.dueDate,
        patientId: formData.patientId,
        assigneeId: formData.assigneeId,
        taskType: activeTab === "myTasks" ? "MY_TASK" : "TEAM_TASK",
      };

      // Determine if creating or updating
      const isEditing = modalState.type === "edit";

      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/tasks/${modalState.taskId}`,
          taskData
        );
        toast.success("Task updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/tasks", taskData);
        toast.success("Task created successfully!");
      }

      // Close modal and refresh tasks
      setModalState({
        type: null,
        isOpen: false,
        taskId: null,
        taskData: null,
      });
      fetchTasks();
    } catch (error) {
      console.error(
        `Error ${modalState.type === "edit" ? "updating" : "creating"} task:`,
        error
      );
      toast.error(
        error.response?.data?.message ||
          `Failed to ${
            modalState.type === "edit" ? "update" : "create"
          } task. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalState({ type: null, isOpen: false, taskId: null, taskData: null });
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <ToastContainer />

      <div className="bg-white shadow">
        <div className="flex justify-between items-center px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Task Management
            </h1>
            <p className="text-sm text-gray-600">
              Track and manage your tasks and team tasks
            </p>
          </div>
          <button
            className="bg-[#4c744a] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            onClick={() =>
              setModalState({
                type: "create",
                isOpen: true,
                taskId: null,
                taskData: null,
              })
            }
          >
            Create Task
          </button>
        </div>

        <div className="px-6 ">
          <div className="flex space-x-6">
            <button
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === "myTasks"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => handleTabChange("myTasks")}
            >
              My Tasks
            </button>
            <button
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === "teamTasks"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => handleTabChange("teamTasks")}
            >
              Team Tasks
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="w-96">
            <input
              type="text"
              placeholder="Search tasks by title or patient..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex space-x-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Due Date</option>
              <option>Priority</option>
              <option>Status</option>
              <option>Title</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-2">
            {activeTab === "myTasks"
              ? `My Tasks (${getTaskList().length})`
              : `Team Tasks (${getTaskList().length})`}
          </div>

          {getTaskList().length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                No tasks found. Create a new task to get started.
              </p>
            </div>
          ) : (
            getTaskList().map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEditClick={handleEditClick}
                onViewDetailsClick={handleViewDetailsClick}
                onStatusChange={handleTaskStatusChange}
                // onDeleteClick={handleDeleteTask}
              />
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Task Modal */}
      <CreateEditTaskModal
        isOpen={
          modalState.isOpen &&
          (modalState.type === "create" || modalState.type === "edit")
        }
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
        isEditing={modalState.type === "edit"}
        initialData={modalState.taskData}
        patientsData={patientsData}
        doctorsData={doctorsData}
        activeTab={activeTab}
      />

      {/* View Task Details Modal */}
      <TaskDetailsModal
        isOpen={modalState.isOpen && modalState.type === "view"}
        onClose={handleCloseModal}
        taskDetails={modalState.taskData}
        onEditClick={(taskId) => {
          handleCloseModal();
          handleEditClick(taskId);
        }}
      />
    </div>
  );
};

export default TasksManagements;
  