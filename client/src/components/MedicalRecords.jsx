import React, { useState, useEffect } from "react";
import { checkPermissions } from "../utils/permissions";
import UploadMedicalRecordsModal from "../components/modals/UploadMedicalRecordsModal";
import MedicalRecordsModal from "../components/modals/MedicalRecordsModal";
import "../styles/Global.css";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [error, setError] = useState("");

  // Get permissions
  const { canAdd, canEdit, canDelete, canView } = checkPermissions();

  // Fetch records from the API when the component adds
  const fetchRecords = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/medicalrecords/getAllRecords`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setFilteredRecords(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch medical records");
      });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    let filtered = [...records];

    if (categoryFilter) {
      filtered = filtered.filter((r) => r.category === categoryFilter);
    }
    if (monthFilter) {
      filtered = filtered.filter((r) => new Date(r.createdAt).getMonth() + 1 === parseInt(monthFilter));
    }
    if (yearFilter) {
      filtered = filtered.filter((r) => new Date(r.createdAt).getFullYear() === parseInt(yearFilter));
    }

    setFilteredRecords(filtered);
  }, [categoryFilter, monthFilter, yearFilter, records]);

  const handleRecordClick = (record) => {
    if (!canView) {
      setError("You don't have permission to view record details");
      return;
    }
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleRecordUpdate = (updatedRecord) => {
    fetchRecords();
    setShowDetailsModal(false);
  };

  const handleRecordDelete = (deletedId) => {
    setRecords((prev) => prev.filter((r) => r._id !== deletedId));
    setShowDetailsModal(false);
  };

  const categories = [
    "Prescriptions", "Laboratory Results", "Imaging Results", "Cardiology",
    "Surgical Reports", "Clinical Notes", "Endoscopy Reports", "Pathology & Cytology",
    "Vital Signs & Measurements", "Vaccination Records", "Allergy & Sensitivity Tests",
    "Dermatology Reports", "Neurological Tests", "Pulmonary", "Obstetrics and Gynecology",
    "Audiology & Vision", "Oncology Reports", "Psychiatric Evaluations"
  ];

  if (!canView) {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6 mr-70 ml-70" style={{ color: 'var(--primary)' }}>Medical Records</h1>
        <p className="text-red-600">You don't have permission to view medical records.</p>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ backgroundColor: 'var(--light)' }}>
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 mr-70 ml-70" style={{ color: 'var(--primary)' }}>Medical Records</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Filter and Upload */}
      <div 
        className="border rounded-lg p-4 mb-6 bg-white shadow-md flex flex-wrap gap-4 items-center" 
        style={{ borderColor: 'var(--light)' }}>
        <select
          className="border rounded p-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {new Date(0, idx).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">All Years</option>
          {[2022, 2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      {canAdd && (
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">
              Upload
            </button>
          </div>
        )}

      {/* Records List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.length === 0 ? (
          <p className="text-gray-500">No medical records found.</p>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record._id}
              onClick={() => handleRecordClick(record)}
              className="cursor-pointer border p-4 rounded-lg shadow hover:bg-blue-50 transition bg-white"
              style={{
                backgroundColor: "var(--medium)",
                border: "1px solid var(--light)",
                color: "white",
              }}
            >
              <div className="text-white">
                <p className="font-medium text-lg">{record.description}</p>
                <p className="text-sm">Doctor: {record.doctorName}</p>
                <p className="text-sm">Category: {record.category}</p>
                <p className="text-sm ">Uploaded: {new Date(record.uploadAt).toLocaleString()}</p>
              </div>
              
              {record.fileUrl && (
                <div className="text-sm mt-2">
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/api/medicalrecords/download/${record._id}`}
                    className="text-white hover:underline hover:text-blue-950"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the modal when clicking download
                    }}
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadMedicalRecordsModal
          onClose={() => setShowUploadModal(false)}
          onUpload={() => {
            fetchRecords();
            setShowUploadModal(false);
          }}
          canAdd={canAdd}
        />
      )}

      {/* View/Edit Modal */}
      {showDetailsModal && selectedRecord && (
        <MedicalRecordsModal
          record={selectedRecord}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={handleRecordUpdate}
          onDelete={handleRecordDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      )}
    </div>
  );
}