import { useState } from "react";
import "../../styles/AddMedicationModal.css";


export default function AddMedicationModal({ onClose, onAdd }) {
  const [medicine, setMedicine] = useState('');
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert("Error: Missing user ID. Please log in again.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/medications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ medicine, time, day, date })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert("Failed to add medication. See console for details.");
        return;
      }

      await response.json();
      onAdd();
      onClose();

    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Add Medication</h3>

        <input
          className="modal-input"
          placeholder="Medicine"
          value={medicine}
          onChange={e => setMedicine(e.target.value)}
        />

        <input
          className="modal-input"
          placeholder="Time (e.g. 6:00 AM)"
          value={time}
          onChange={e => setTime(e.target.value)}
        />

        <input
          className="modal-input"
          placeholder="Day (e.g. Monday)"
          value={day}
          onChange={e => setDay(e.target.value)}
        />

        <input
          type="date"
          className="modal-input"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <div className="modal-actions">
          <button className="modal-button-primary" onClick={handleSubmit}>Add</button>
          <button className="modal-button-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
