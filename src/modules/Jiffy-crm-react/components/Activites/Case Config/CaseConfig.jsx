import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import CaseType from "./Nav Cases/CaseType";
import CaseStatus from "./Nav Cases/CaseStatus";
import CasePriorities from "./Nav Cases/CasePriorities";

// The base URL for your API.
const API_BASE_URL = "http://localhost:8080/api/case-config";

// --- Parent Component: CaseConfiguration ---
const CaseConfiguration = () => {
    const [activeTab, setActiveTab] = useState("Case Types");
    const [caseTypes, setCaseTypes] = useState([]);
    const [caseStatuses, setCaseStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetches all config data initially when the component mounts.
    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            fetch(`${API_BASE_URL}/TYPE`).then(res => res.json()),
            fetch(`${API_BASE_URL}/STATUS`).then(res => res.json()),
            fetch(`${API_BASE_URL}/PRIORITY`).then(res => res.json()),
        ]).then(([typesData, statusesData, prioritiesData]) => {
            setCaseTypes(Array.isArray(typesData) ? typesData : []);
            setCaseStatuses(Array.isArray(statusesData) ? statusesData : []);
            setPriorities(Array.isArray(prioritiesData) ? prioritiesData : []);
        }).catch(e => {
            console.error("Failed to fetch initial data:", e);
            setError("Failed to load configuration. Please check the API and refresh.");
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    // Handles adding a new item by sending a POST request to the API.
    const handleAddItem = async (itemData, type) => {
        let payload = { ...itemData };
        
        // If the item being added has a 'priority' field, we find the corresponding
        // priority object to get its 'color' to send to the API.
        if (itemData.priority) {
            const priorityObj = priorities.find(p => p.name === itemData.priority);
            payload.color = priorityObj ? priorityObj.color : 'Default';
            delete payload.priority; // The API expects 'color', not 'priority'.
        }
        
        payload.type = type.toUpperCase();

        try {
            const response = await fetch(`${API_BASE_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            
            // After adding, refetch the data for the current tab to show the update.
            const freshDataResponse = await fetch(`${API_BASE_URL}/${type.toUpperCase()}`);
            const freshData = await freshDataResponse.json();

            if (type === 'TYPE') setCaseTypes(Array.isArray(freshData) ? freshData : []);
            else if (type === 'STATUS') setCaseStatuses(Array.isArray(freshData) ? freshData : []);
            else if (type === 'PRIORITY') setPriorities(Array.isArray(freshData) ? freshData : []);

        } catch (e) {
            console.error("Error adding item:", e);
            setError("Could not save the new item. Please try again.");
        }
    };

    // Renders the content based on the active tab.
    const renderTabContent = () => {
        if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
        switch (activeTab) {
            case "Case Types":
                return <CaseType types={caseTypes} priorities={priorities} onAdd={handleAddItem} isLoading={isLoading} />;
            case "Case Statuses":
                return <CaseStatus statuses={caseStatuses} priorities={priorities} onAdd={handleAddItem} isLoading={isLoading} />;
            case "Priorities":
                return <CasePriorities priorities={priorities} onAdd={handleAddItem} isLoading={isLoading} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center text-gray-600 mb-2">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        <span className="text-sm">/admin/case-config</span>
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-900">Case Configuration</h1>
                    <p className="text-gray-600 mt-1">Manage case types, statuses, and priorities</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="flex bg-gray-100 p-1 rounded-t-lg space-x-2 px-2">
                            {["Case Types", "Case Statuses", "Priorities"].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === tab ? "bg-[#4c744a] text-white shadow-sm" : "text-gray-600 hover:bg-white/50 hover:text-gray-800"}`}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default CaseConfiguration;

