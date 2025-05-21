import React, { useState } from "react";
import FileUploadForm from "./FileUploadForm.jsx"; // adjust path if needed
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { storage } from "../firebase";

export default function MedicalRecords() {
  const [showForm, setShowForm] = useState(false);

  const handleAddClick = () => {
    setShowForm(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Button aligned to the right */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddClick}
            className="grid grid-flow-col justify-items-end text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Add
          </button>
        </div>

        {/* Title */}
        <div>MEDICAL RECORDS</div>

        {/* Content box */}
        <div className="border w-full h-screen border-black p-4 overflow-auto">
          {showForm ? (
            <FileUploadForm />
          ) : (
            <p>Click the "Add" button to upload medical records.</p>
          )}
        </div>
      </div>
    </>
  );
}
