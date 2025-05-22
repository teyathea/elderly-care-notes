import React, { useEffect, useState } from "react";

export default function MedicalRecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    fetch("http://localhost:8000/api/medicalrecords/getAllRecords") // your GET endpoint
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch records");
        return res.json();
      })
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading records...</p>;
  if (error) return <p>Error: {error}</p>;

   return (
    <div>
      <h2>Uploaded Medical Records</h2>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <ul>
          {records.map((record) => (
            <li key={record._id} style={{ marginBottom: "1rem" }}>

              <p><strong>Description:</strong> {record.description}</p>
              <p><strong>Doctor:</strong> {record.doctorName}</p>
              <p><strong>Category:</strong> {record.category}</p>
              <p><strong>Fila Name:</strong> {record.originalName}</p>

              {record.fileUrl && (
                <>
                <a href={record.fileUrl} rel="noopener noreferrer" download={record.originalName}>
                  View |
                </a>
                
                <a href={`http://localhost:8000/api/medicalrecords/download/${record._id}`} rel="noopener noreferrer" >
                    Download
                </a>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}