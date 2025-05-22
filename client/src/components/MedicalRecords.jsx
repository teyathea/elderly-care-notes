// import React, { useState } from "react";
// import FileUploadForm from "./FileUploadForm.jsx"; 
// import MedicalRecordsList from "./MedicalRecordsList.jsx";


// export default function MedicalRecords() {
//   const [showForm, setShowForm] = useState(false);

//   const handleAddClick = () => {
//     setShowForm(true);
//   };

//   return (
//     <>
//       <div className="flex flex-col gap-4">
//         {/* Button aligned to the right */}
//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={handleAddClick}
//             className="grid grid-flow-col justify-items-end text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
//           >
//             Add
//           </button>
//         </div>

//         {/* Title */}
//         <div>MEDICAL RECORDS</div>

//         {/* Content box */}
//         <div className="border w-full h-screen border-black p-4 overflow-auto">
//           {showForm ? (
//             <FileUploadForm />
//           ) : (
//             <>
//             <MedicalRecordsList />
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }



import React, { useState, useEffect } from "react";
import UploadMedicalRecordsModal from "../components/modals/UploadMedicalRecordsModal";
import MedicalRecordsModal from "../components/modals/MedicalRecordsModal";
<<<<<<< HEAD
import { Download, Edit, Trash2, Save, X } from "lucide-react";

=======
import "../styles/Global.css";
>>>>>>> main

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  

  useEffect(() => {
    fetch("http://localhost:8000/api/medicalrecords/getAllRecords")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setFilteredRecords(data);
      })
      .catch((err) => console.error("Fetch error:", err));
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
    // console.log(record.uploadAt)
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleRecordUpdate = (updatedRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r._id === updatedRecord._id ? updatedRecord : r))
    );
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

  return (
    <div className="p-4" style={{ backgroundColor: 'var(--light)' }}>
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 mr-70 ml-70" style={{ color: 'var(--primary)' }}>Medical Records</h1>

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
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
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

<<<<<<< HEAD
{/* ////////////////////////////
// UPLOAD BUTTON AND RECORD LIST 
///////////////////////////////*/}

        <div className="text-black">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">
              Upload
            </button>
          </div>

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
              >
                {/* <button>DELETE</button> */}
                <div className="flex justify-end">
                  <button onClick={() => setShowDeleteConfirm(true)} className=" bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center" >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-medium text-lg capitalize">{record.description}</p>
                <p className="text-sm text-gray-600 capitalize">Doctor: {record.doctorName}</p>
                <p className="text-sm text-gray-600">Category: {record.category}</p>
                <p className="text-sm text-gray-600">{new Date(record.uploadAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
=======
      {/* Records List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.length === 0 ? (
          <p className="text-gray-500">No medical records found.</p>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record._id || `temp-${Date.now()}-${Math.random()}`}
              onClick={() => handleRecordClick(record)}
              className="cursor-pointer border p-4 rounded-lg shadow hover:bg-blue-50 transition bg-white"
              style={{
                backgroundColor: "var(--medium)",
                border: "1px solid var(--light)",
                color: "white",
              }}
            >
              <p className="font-medium text-lg">{record.description}</p>
              <p className="text-sm text-gray-600">Doctor: {record.doctorName}</p>
              <p className="text-sm text-gray-600">Category: {record.category}</p>
              <p className="text-sm text-gray-600">Uploaded: {new Date(record.date).toLocaleString()}</p>
            </div>
          ))
        )}
>>>>>>> main
      </div>
       

{/* /////////////////////////////
// MODALS - FOR UPLOAD AND VIEW
//////////////////////////////// */}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadMedicalRecordsModal
          onClose={() => setShowUploadModal(false)}
          onUpload={(newRecord) => setRecords((prev) => [...prev, newRecord])}
        />
      )}


      {/* View/Edit Modal */}
      {showDetailsModal && selectedRecord && (
        <MedicalRecordsModal
          record={selectedRecord}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={handleRecordUpdate}
          onDelete={handleRecordDelete}
        />
      )}

      {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="mb-4">
                Are you sure you want to delete this record?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}