import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Plus, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import EscalationRuleModal from "./EscalationRuleModal";
import axios from "axios";
import { toast } from "react-toastify";

const EscalationRules = ({ ToastContainer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rules, setRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState(null);

  const fetchSlaRules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/escalation-rules/all"
      );
      setRules(response.data);
    } catch (e) {
      console.error("Failed to fetch SLA rules:", e);
      setError(
        "Could not load data. Please ensure the backend API is running and accessible."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlaRules();
  }, [fetchSlaRules]);

  const handleEditClick = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/escalation-rules/${id}`
      );
      setSelectedRule(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading rule:", error);
      toast.error("Failed to load rule data.");
    }
  };

  // ⭐ 1. UPDATED SEARCH LOGIC
  // This logic now correctly searches inside the roles and doctors arrays.
  const filteredRules = useMemo(() => {
    if (!searchTerm) {
      return rules;
    }
    const searchLower = searchTerm.toLowerCase();
    return rules.filter((rule) => {
      const ruleNameMatch = rule.ruleName?.toLowerCase().includes(searchLower);
      const slaMatch = rule.appliedToSla?.toLowerCase().includes(searchLower);

      const targets = rule.escalationTargets;
      const roleMatch = targets?.roles?.some((r) =>
        r.name.toLowerCase().includes(searchLower)
      );
      const doctorMatch = targets?.doctors?.some((d) =>
        d.name.toLowerCase().includes(searchLower)
      );

      return ruleNameMatch || slaMatch || roleMatch || doctorMatch;
    });
  }, [rules, searchTerm]);

  const ITEMS_PER_PAGE = 5;
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

  const handleToggleStatus = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/escalation-rules/${id}/toggle-status`
      );
      toast.success("Status toggled successfully");
      fetchSlaRules();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to toggle status.");
    }
  };

  // ⭐ 2. INLINE RENDER FUNCTION FOR TARGETS
  // This helper function will render the roles and doctors without needing a separate component.
  const renderEscalationTargets = (targets) => {
    const roles = targets?.roles || [];
    const doctors = targets?.doctors || [];

    if (roles.length === 0 && doctors.length === 0) {
      return <span className="text-gray-400 italic">No targets</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role) => (
          <span
            key={`role-${role.id}`}
            className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
          >
            {role.name}
          </span>
        ))}
        {doctors.map((doctor) => (
          <span
            key={`doc-${doctor.id}`}
            className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800"
          >
            {doctor.name}
          </span>
        ))}
      </div>
    );
  };


  const tableHeaders = [
    "Rule Name",
    "Applied to Sla",
    "Triggers",
    "Escalation Target",
    "Status",
    "Actions",
  ];

  if (isLoading && rules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-800"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className=" bg-gray-50 ">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
          <div className="relative flex-1 sm:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by rule, SLA, or target..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setSelectedRule(null);
            }}
            className="flex items-center justify-center bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors font-medium whitespace-nowrap"
          >
            <Plus size={18} className="mr-2" />
            <span className="hidden xs:inline">Add Escalation Rule</span>
            <span className="xs:hidden">Add Rule</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRules.map((rule) => (
                  <tr key={rule.escalationId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 truncate">
                      {rule.ruleName}
                    </td>
                    <td className="px-4 py-3 text-gray-700 truncate">
                      {rule.appliedToSla}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {Array.isArray(rule.triggers) &&
                      rule.triggers.length > 0 ? (
                        rule.triggers.map((cond, i) => (
                          <div key={i} className="truncate">
                            {cond.type} {cond.operator} {cond.value} {cond.unit}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 italic">
                          No triggers
                        </span>
                      )}
                    </td>
                    {/* ⭐ 3. USE THE RENDER FUNCTION HERE */}
                    <td className="px-4 py-3 text-gray-700">
                      {renderEscalationTargets(rule.escalationTargets)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(rule.escalationId)}
                        className={`h-6 w-11 rounded-full flex items-center transition-colors ${
                          rule.status === "Active"
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 bg-white rounded-full transform transition-transform ${
                            rule.status === "Active"
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditClick(rule.escalationId)}
                        title="Edit"
                        className="text-gray-500 hover:text-green-700"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="text-sm text-gray-500 order-2 sm:order-1">
              <span className="hidden sm:inline">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredRules.length)} of{" "}
                {filteredRules.length} results
              </span>
              <span className="sm:hidden">{filteredRules.length} results</span>
            </div>
            <div className="flex items-center space-x-2 order-1 sm:order-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-700 px-2">
                <span className="hidden xs:inline">
                  Page {currentPage} of {totalPages}
                </span>
                <span className="xs:hidden">
                  {currentPage}/{totalPages}
                </span>
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <EscalationRuleModal
            ToastContainer={ToastContainer}
            isOpen={isModalOpen}
            editData={selectedRule}
            fetchSlaRules={fetchSlaRules}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedRule(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default EscalationRules;