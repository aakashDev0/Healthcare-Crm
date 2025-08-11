import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  ArrowLeft,
  MessageSquare,
  Mail,
  Phone,
} from "lucide-react";

const NotificationTemplatesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("SMS");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Add templates state
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state variables
  const [templateName, setTemplateName] = useState("");
  const [smsContent, setSmsContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [whatsappSubject, setWhatsappSubject] = useState("");
  const [whatsappBody, setWhatsappBody] = useState("");

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/notifications/getAll');
      setTemplates(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setTemplateName("");
    setSmsContent("");
    setEmailSubject("");
    setEmailBody("");
    setWhatsappSubject("");
    setWhatsappBody("");
  };

  // Update closeModal to reset form
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
  
  // Add handleSubmit function
  const handleSubmit = async () => {
    try {
      const templateData = {
        templateName,
        channelType: activeTab,
        smsContent: activeTab === "SMS" ? smsContent : null,
        emailSubject: activeTab === "Email" ? emailSubject : null,
        emailBody: activeTab === "Email" ? emailBody : null,
        whatsappSubject: activeTab === "WhatsApp" ? whatsappSubject : null,
        whatsappBody: activeTab === "WhatsApp" ? whatsappBody : null,
        status: "active"
      };

      await axios.post('http://localhost:8080/api/notifications', templateData);
      await fetchTemplates(); // Refresh the templates after adding a new one
      closeModal();
    } catch (err) {
      console.error('Failed to create template:', err);
    }
  };

  // Filter data based on search query
  const filteredData = templates.filter((template) => {
    const query = searchQuery.toLowerCase();
    return (
      template.templateName?.toLowerCase().includes(query) ||
      template.channelType?.toLowerCase().includes(query) ||
      template.status?.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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

  // Modal functionality
  const openModal = () => setIsModalOpen(true);

  // Channel type icon mapping
  const getChannelIcon = (type) => {
    switch (type) {
      case "SMS":
        return <Phone size={16} className="text-blue-500" />;
      case "Email":
        return <Mail size={16} className="text-green-500" />;
      case "WhatsApp":
        return <MessageSquare size={16} className="text-purple-500" />;
      default:
        return null;
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <ArrowLeft className="text-gray-500 mr-2" size={20} />
            <h2 className="text-gray-700 text-lg font-medium">
              Notification Templates
            </h2>
          </div>
          <p className="text-gray-500 text-sm">/admin/notifications</p>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Notification Templates
              </h1>
              <p className="text-gray-500">
                Manage notification templates and delivery
              </p>
            </div>
            <button
              onClick={openModal}
              className="bg-[#4c744a] hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Add Template
            </button>
          </div>

          {/* Search and filter */}
          <div className="mb-6 relative">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <div className="pl-3 pr-2 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                className="py-2 px-2 w-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="pr-3 pl-2 text-gray-400 border-l border-gray-300">
                <Filter size={20} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">Loading templates...</div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600">{error}</div>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-600">No templates found</div>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-600 font-medium">
                      Template Name
                    </th>
                    <th className="py-3 px-4 text-gray-600 font-medium">
                      Channel Type
                    </th>
                    <th className="py-3 px-4 text-gray-600 font-medium">
                      Last Modified
                    </th>
                    <th className="py-3 px-4 text-gray-600 font-medium">
                      Status
                    </th>
                    <th className="py-3 px-4 text-gray-600 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((template) => (
                    <tr
                      key={template.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-gray-800 font-medium">
                        {template.templateName}
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        <div className="flex items-center">
                          {getChannelIcon(template.channelType)}
                          <span className="ml-2">{template.channelType}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {formatDate(template.updatedAt)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            template.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <button className="text-blue-600 hover:text-green-800 font-medium">
                            Edit
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 font-medium">
                            Preview
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && totalPages > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} templates
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50"> 
          <div className="bg-white rounded-lg shadow-lg w-full h-130 overflow-auto max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Create Notification Template
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex">
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "SMS"
                    ? "text-green-800 border-b-2 border-green-800"
                    : "text-green-500 hover:text-green-700"
                }`}
                onClick={() => setActiveTab("SMS")}
              >
                SMS
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "Email"
                    ? "text-green-800 border-b-2 border-green-800"
                    : "text-green-500 hover:text-green-700"
                }`}
                onClick={() => setActiveTab("Email")}
              >
                Email
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "WhatsApp"
                    ? "text-green-800 border-b-2 border-green-800"
                    : "text-green-500 hover:text-green-700"
                }`}
                onClick={() => setActiveTab("WhatsApp")}
              >
                WhatsApp
              </button>
            </div>

            <div>
              {(() => {
                switch (activeTab) {
                  case "SMS":
                    return (
                      <div className="p-6">
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Template Name
                          </label>
                          <input
                            type="text"
                            placeholder="Template Name"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Message Content
                          </label>
                          <textarea
                            placeholder="Enter your message here..."
                            value={smsContent}
                            onChange={(e) => setSmsContent(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Variables
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm">
                              {"{patient_name}"}
                            </button>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm">
                              {"{appointment_date}"}
                            </button>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm">
                              {"{appointment_time}"}
                            </button>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm">
                              {"{doctor_name}"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  case "Email":
                    return (
                      <div className="p-6">
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Template Name
                          </label>
                          <input
                            type="text"
                            placeholder="Template Name"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Subject Name
                          </label>
                          <input
                            type="text"
                            placeholder="Subject Name"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Email Body
                          </label>
                          <textarea
                            placeholder="Enter your email content here..."
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                          />
                        </div>
                      </div>
                    );
                  case "WhatsApp":
                    return (
                      <div className="p-6">
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Template Name
                          </label>
                          <input
                            type="text"
                            placeholder="Template Name"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Subject Name
                          </label>
                          <input
                            type="text"
                            placeholder="Subject Name"
                            value={whatsappSubject}
                            onChange={(e) => setWhatsappSubject(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Message Body
                          </label>
                          <textarea
                            placeholder="Enter your message here..."
                            value={whatsappBody}
                            onChange={(e) => setWhatsappBody(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                          />
                        </div>
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </div>

            {/* Form */}
            <div className="flex justify-end p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#4c744a] text-white rounded-md hover:bg-green-600"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationTemplatesPage;