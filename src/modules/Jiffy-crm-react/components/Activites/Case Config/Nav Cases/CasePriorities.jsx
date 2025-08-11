import React, { useState } from "react";
import { Plus, Search, Check } from "lucide-react";

// --- Child Component: CasePriorities ---
const CasePriorities = ({ priorities, onAdd, isLoading }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPriority, setNewPriority] = useState({
        name: "",
        description: "",
        color: "",
    });

    const colorOptions = [
        { name: "Red", className: "bg-red-500" },
        { name: "Orange", className: "bg-orange-500" },
        { name: "Yellow", className: "bg-yellow-500" },
        { name: "Green", className: "bg-green-500" },
        { name: "Blue", className: "bg-blue-500" },
        { name: "Teal", className: "bg-teal-500" },
        { name: "Purple", className: "bg-purple-500" },
        { name: "Pink", className: "bg-pink-500" },
    ];

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-800"></div>
            </div>
        );
    }

    const filteredData = (priorities || []).filter(
        (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCreatePriority = () => {
        if (newPriority.name && newPriority.description && newPriority.color) {
            onAdd(newPriority, 'PRIORITY');
            setNewPriority({ name: "", description: "", color: "" });
            setIsModalOpen(false);
        } else {
            alert("Please fill all fields and select a color.");
        }
    };

    return (
        <div>
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search priorities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="ml-4 bg-[#4c744a] hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center font-medium transition-colors">
                        <Plus className="w-4 h-4 mr-2" /> Add Priority
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{item.name}</div></td>
                                <td className="px-6 py-4"><div className="text-sm text-gray-600 max-w-md truncate">{item.description}</div></td>
                                <td className="px-6 py-4 whitespace-nowrap"><button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Priority Level</h2>
                        <div className="space-y-4">
                           {/* Form fields for new priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority Name</label>
                                <input type="text" placeholder="e.g., 'Critical'" value={newPriority.name} onChange={(e) => setNewPriority({ ...newPriority, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea placeholder="Describe when to use this priority" value={newPriority.description} onChange={(e) => setNewPriority({ ...newPriority, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Color</label>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {colorOptions.map(color => (
                                        <button key={color.name} onClick={() => setNewPriority({...newPriority, color: color.name})} className={`w-full h-10 rounded-md flex items-center justify-center transition-all ${color.className} ${newPriority.color === color.name ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}>
                                            {newPriority.color === color.name && <Check className="w-5 h-5 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium">Cancel</button>
                            <button onClick={handleCreatePriority} className="px-4 py-2 bg-[#4c744a] hover:bg-green-700 text-white rounded-md font-medium">Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CasePriorities;
