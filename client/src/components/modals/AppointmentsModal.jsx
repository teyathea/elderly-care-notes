import React, { useState, useRef, useEffect } from "react";
import "../../styles/Global.css";

const AppointmentsModal = ({
  date,
  appointments,
  setAppointments,
  onClose,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    time: "",
    assignedTo: "",
  });

  const modalRef = useRef();

  useEffect(() => {
    // Handler for clicks outside the modal
    const handleOutsideClick = (e) => {
      // If the click target is outside the modal element, trigger onClose
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    // Handler for pressing the Escape key
    const handleEscape = (e) => {
      // If Escape key is pressed, trigger onClose
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Add event listeners when the component mounts
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    // Cleanup event listeners when the component unmounts or when onClose changes
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      time: "",
      assignedTo: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddAppointment = () => {
    const newAppointment = {
      id: Date.now(),
      ...formData,
      date,
    };
    setAppointments((prev) => [...prev, newAppointment]);
    resetForm();
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    setFormData({ ...appointment });
    setShowForm(true);
  };

  const handleSaveEdit = () => {
    const updated = appointments.map((app) =>
      app.id === editingId ? { ...formData, id: editingId, date } : app
    );
    setAppointments(updated);
    resetForm();
  };

  const handleDelete = (id) => {
    const updated = appointments.filter((app) => app.id !== id);
    setAppointments(updated);
  };

  const appointmentsForDate = appointments.filter((app) => app.date === date);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay">
      <div
        ref={modalRef}
        className="rounded-lg shadow-lg p-6 w-full max-w-3xl relative bg-white"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--text)]">
            Appointments on {date}
          </h2>
          {!showForm && (
            <button onClick={() => setShowForm(true)}>+ Add</button>
          )}
        </div>

        {showForm ? (
          <div className="space-y-2 border border-[var(--highlight)] p-4 rounded bg-white">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-2 border rounded"
              autoFocus
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-2 border rounded"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Assigned To"
              className="w-full p-2 border rounded"
            >
              <option>Family Member</option>
              <option>Caregiver</option>
            </select>
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={editingId ? handleSaveEdit : handleAddAppointment}
              >
                Save
              </button>
              <button onClick={resetForm}>Cancel</button>
            </div>
          </div>
        ) : appointmentsForDate.length === 0 ? (
          <p className="text-center text-[var(--text)] italic">
            You have no appointments today. Take a break!
          </p>
        ) : (
          <ul className="space-y-4 max-h-80 overflow-y-auto">
            {appointmentsForDate.map((app) => (
              <li
                key={app.id}
                className="border border-[var(--accent)] bg-[var(--light)] rounded p-4"
              >
                <p>
                  <strong>Title:</strong> {app.title}
                </p>
                <p>
                  <strong>Description:</strong> {app.description}
                </p>
                <p>
                  <strong>Location:</strong> {app.location}
                </p>
                <p>
                  <strong>Time:</strong> {app.time}
                </p>
                <p>
                  <strong>Assigned To:</strong> {app.assignedTo}
                </p>
                <div className="flex gap-2 justify-end mt-2">
                  <button onClick={() => handleEdit(app)}>Edit</button>
                  <button onClick={() => handleDelete(app.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AppointmentsModal;