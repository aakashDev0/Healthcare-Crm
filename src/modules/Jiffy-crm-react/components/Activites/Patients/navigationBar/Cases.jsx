import { AlertTriangle, Clock } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CaseView from "../../Cases/CaseView";
const Cases = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientCases, setPatientCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const[selectedCases, setSelectedCases] = useState()
  const[currentPage, setCurrentPage] = useState("list")
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleViewCases = (caseView) =>{
    setSelectedCases(caseView);
    setCurrentPage("details");
  }

  const handleBackToList = () =>{
    setCurrentPage("list");
    setSelectedCases(null);
  }
    useEffect(() => {
      const fetchPatientAndCases = async () => {
        setIsLoading(true);
        try {
          // Get patient ID from localStorage (same as in Tasks.jsx)
          const patientId = localStorage.getItem("patientId");
          
          if (patientId) {
            // Fetch patient details
            const patientResponse = await axios.get(`http://localhost:8080/api/patients/${patientId}`);
            setPatient(patientResponse.data);
            
            // Fetch all cases
            const casesResponse = await axios.get("http://localhost:8080/api/case/all");
            
            // Filter cases for this patient
            const filteredCases = casesResponse.data.filter(
              caseItem => caseItem.patient && caseItem.patient.patientId === parseInt(patientId)
            );
            
            setPatientCases(filteredCases);
          }
        } catch (error) {
          console.error("Error fetching patient cases:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPatientAndCases();
    }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get SLA status display
  const getSlaStatus = (caseItem) => {
    // This is a placeholder - you would need to implement actual SLA logic
    // based on your business rules and case data
    if (caseItem.caseStatus === "Open" && caseItem.priority === "High") {
      return (
        <div className="flex items-center text-yellow-500 text-sm mt-1">
          <Clock size={16} className="mr-1" />
          <span>2 hours remaining</span>
        </div>
      );
    } else if (caseItem.caseStatus === "Open" && new Date(caseItem.creationDate) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      return (
        <div className="flex items-center text-red-500 text-sm mt-1">
          <AlertTriangle size={16} className="mr-1" />
          <span>SLA Breached</span>
        </div>
      );
    }
    return null;
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "In_Progress":
        return "bg-indigo-500";
      case "Open":
        return "bg-blue-500";
      case "Closed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if(currentPage == "details" && selectedCases){
    return <CaseView onBack={handleBackToList} />
  }
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-700">
              Patient Cases
            </h1>
            <p className="text-gray-500 text-sm">
              All cases associated with {patient?.fullName || "this patient"}
            </p>
          </div>
          {/* Create Case button commented out as in original */}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            {/* Modal content remains the same */}
            <form className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              {/* ... existing modal content ... */}
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>
        ) : patientCases.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No cases found for this patient.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            {patientCases.map((caseItem) => (
              <div key={caseItem.caseId} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div className="flex items-center mb-2">
                      <h2 className="text-lg font-medium text-gray-700 mr-3">
                        {caseItem.caseName}
                      </h2>
                      <span className={`${getStatusBadgeColor(caseItem.caseStatus)} text-white text-xs px-2 py-1 rounded`}>
                        {caseItem.caseStatus}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Case #{caseItem.caseId} • {caseItem.patient?.fullName || "Unknown Patient"} • 
                      Created {caseItem.creationDate ? formatDate(caseItem.creationDate) : "N/A"}
                    </p>
                    {getSlaStatus(caseItem)}
                  </div>
                  <button 
                    className="mt-3 md:mt-0 px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                    onClick={() => {
                      handleViewCases(caseItem)
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;
