import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Edit, Plus, Search } from "lucide-react";
import axios from "axios";
import SlaRuleModal from "./SlaRuleModal";
import { toast } from "react-toastify";

const SlaRule = ({ ToastContainer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rules, setRules] = useState([]);
  const [editRule, setEditRule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRule, setSelectedRule] = useState(null);

  const ITEMS_PER_PAGE = 5;

  const fetchRules = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/sla-rules/all"
      );
      setRules(response.data);
    } catch (error) {
      console.error("Failed to fetch rules", error);
    }
  };

  const handleEditClick = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/sla-rules/${id}`
      );
      setSelectedRule(response.data);
      setEditRule(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading rule:", error);
      toast.error("Failed to load rule data.");
    }
  };

  const handleAddClick = () => {
    setSelectedRule(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/sla-rules/toggle-status/${id}`
      );
      console.log("Status toggled successfully");
      fetchRules();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        rule.ruleName?.toLowerCase().includes(searchLower) ||
        rule.caseType?.toLowerCase().includes(searchLower) ||
        rule.priority?.toLowerCase().includes(searchLower)
      );
    });
  }, [rules, searchTerm]);

  const totalPages = Math.ceil(filteredRules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRules = filteredRules.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const tableHeaders = [
    "Rule Name",
    "Condition",
    "Response Time",
    "Status",
    "Actions",
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="relative flex-1 sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search SLA rules..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          <span>Add SLA Rule</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRules.map((rule, index) => (
                <tr
                  key={rule.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-t`}
                >
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {rule.ruleName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono whitespace-pre-line">
                    {rule.conditions.map((cond, i) => (
                      <div key={i}>
                        {cond.field} {cond.operator} {cond.value}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {rule.responseTimeInHours} hours
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => handleToggleStatus(rule.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        rule.status === "Active"
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          rule.status === "Active"
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>

                  <td className="px-6 py-4 flex items-center gap-3">
                    <button
                      onClick={() => handleEditClick(rule.id)}
                      title="Edit"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    {/* <button
                      onClick={() => handleToggleStatus(rule.id)}
                      title="Toggle Status"
                    >
                      {rule.status === "Active" ? (
                        <ToggleRight size={22} className="text-green-600" />
                      ) : (
                        <ToggleLeft size={22} className="text-gray-400" />
                      )}
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-500">
            <span>
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredRules.length)} of{" "}
              {filteredRules.length} results
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded border border-gray-300 disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded border border-gray-300 disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <SlaRuleModal
        ToastContainer={ToastContainer}
        onClose={() => {
          setIsModalOpen(false);
          setEditRule(null);
        }}
        isOpen={isModalOpen}
        fetchRules={fetchRules}
        editData={selectedRule}
        initialData={editRule}
      />
    </>
  );
};

export default SlaRule;

