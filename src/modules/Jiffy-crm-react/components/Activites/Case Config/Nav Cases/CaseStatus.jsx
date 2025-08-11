import React, { useState } from "react";
import { Plus, Search } from "lucide-react";

// Helper function to get color for a priority badge.
const getPriorityBadgeClass = (priorityName) => {
    const classMap = {
        "Critical": "bg-red-100 text-red-800",
        "High": "bg-orange-100 text-orange-800",
        "Medium": "bg-yellow-100 text-yellow-800",
        "Low": "bg-green-100 text-green-800",
    };
    return classMap[priorityName] || "bg-gray-100 text-gray-800";
};

// --- Child Component: CaseStatus ---
const CaseStatus = ({ statuses, priorities, onAdd, isLoading }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCaseStatus, setNewCaseStatus] = useState({
        name: "",
        description: "",
        priority: "",
    });

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-800"></div>
            </div>
        );
    }

    // Finds the priority name associated with a status's color for display.
    const getPriorityByColor = (color) => {
        const priority = (priorities || []).find(p => p.color === color);
        return priority ? priority.name : 'N/A';
    };

    const filteredData = (statuses || []).filter(
        (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCreateCaseStatus = () => {
        if (newCaseStatus.name && newCaseStatus.description && newCaseStatus.priority) {
            onAdd(newCaseStatus, 'STATUS');
            setNewCaseStatus({ name: "", description: "", priority: "" });
            setIsModalOpen(false);
        } else {
            alert("Please fill all fields and select a priority.");
        }
    };

    return (
        <div>
            <div className="p-6 border-b border-gray-200">
                 <div className="flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="Search statuses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="ml-4 bg-[#4c744a] hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center font-medium transition-colors">
                        <Plus className="w-4 h-4 mr-2" /> Add Status
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((item) => {
                            const priorityName = getPriorityByColor(item.color);
                            return (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{item.name}</div></td>
                                    <td className="px-6 py-4"><div className="text-sm text-gray-600 max-w-md truncate">{item.description}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeClass(priorityName)}`}>
                                            {priorityName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

             {isModalOpen && (
                 <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Case Status</h2>
                        <div className="space-y-4">
                           <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status Name</label>
                                <input type="text" placeholder="e.g., 'In Progress'" value={newCaseStatus.name} onChange={(e) => setNewCaseStatus({ ...newCaseStatus, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea placeholder="Describe when to use this status" value={newCaseStatus.description} onChange={(e) => setNewCaseStatus({ ...newCaseStatus, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Priority</label>
                                <select value={newCaseStatus.priority} onChange={(e) => setNewCaseStatus({ ...newCaseStatus, priority: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option value="" disabled>Select a priority</option>
                                    {(priorities || []).map(p => (<option key={p.id} value={p.name}>{p.name}</option>))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium">Cancel</button>
                            <button onClick={handleCreateCaseStatus} className="px-4 py-2 bg-[#4c744a] hover:bg-green-700 text-white rounded-md font-medium">Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CaseStatus;
