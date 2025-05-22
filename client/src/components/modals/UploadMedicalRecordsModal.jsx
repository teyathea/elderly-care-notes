import { useState } from "react";
import toast from "react-hot-toast";

export default function UploadMedicalRecordsModal({ onClose, onUpload }) {
  const [doctorName, setDoctorName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [category, setCategory] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorName || !description || !category || !file) {
      toast.error("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("doctorName", doctorName);
    formData.append("description", description);
    formData.append("category", category);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/api/medicalrecords/upload");

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percent);
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        toast.success("File and data uploaded successfully!");
        setDoctorName("");
        setDescription("");
        setFile(null);
        setCategory("");
        setUploadProgress(0);
        document.getElementById("fileInput").value = "";
        
        onClose();
        onUpload?.();
      } else {
        toast.error("Failed to upload file and data.");
        setUploadProgress(0);
      }
    };

    xhr.onerror = () => {
      toast.error("Error uploading file.");
      setUploadProgress(0);
    };

    xhr.send(formData);
  };

  const categories = [
    'Prescriptions', 'Laboratory Results', 'Imaging Results', 'Cardiology', 'Surgical Reports',
    'Clinical Notes', 'Endoscopy Reports', 'Pathology & Cytology', 'Vital Signs & Measurements',
    'Vaccination Records', 'Allergy & Sensitivity Tests', 'Dermatology Reports', 'Neurological Tests',
    'Pulmonary', 'Obstetrics and Gynecology', 'Audiology & Vision', 'Oncology Reports', 'Psychiatric Evaluations'
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay">
      <div className="bg-[var(--light)] w-full max-w-lg p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Medical Record</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Doctor’s Name:</label>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 mt-1 ${!doctorName && uploadProgress === 0 ? 'border-red-500' : 'border-gray-300'}`}
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Description:</label>
            <textarea
              placeholder="Type description..."
              className={`w-full border rounded px-3 py-2 mt-1 ${!description && uploadProgress === 0 ? 'border-red-500' : 'border-gray-300'}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Category:</label>
            <select
              className={`w-full border rounded px-3 py-2 mt-1 ${!category && uploadProgress === 0 ? 'border-red-500' : 'border-gray-300'}`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Select File:</label>
            <input
              type="file"
              id="fileInput"
              className={`mt-1 ${!file && uploadProgress === 0 ? 'border-red-500 border rounded px-2 py-1' : ''}`}
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploadProgress > 0}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
