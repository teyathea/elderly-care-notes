import React, { useState } from "react";

export default function FileUploadForm() {
  const [doctorName, setDoctorName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorName || !description || !file) {
      setMessage("Please fill all fields and select a file.");
      return;
    }

    // Create FormData to send file + data to backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("doctorName", doctorName);
    formData.append("description", description);

    try {
      const res = await fetch("http://localhost:8000/api/medicalrecords/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("File and data uploaded successfully!");
        setDoctorName("");
        setDescription("");
        setFile(null);
        setUploadProgress(0);
        document.getElementById("fileInput").value = "";
      } else {
        setMessage("Failed to upload file and data.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error uploading file.");
    }
  };

  return (
    <div>
      <h2>Upload File and Info</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Doctor’s Name:</label>
          <input
            type="text"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Select File:</label>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Upload</button>
      </form>

      {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
