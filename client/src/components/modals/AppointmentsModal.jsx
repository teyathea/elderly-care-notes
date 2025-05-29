import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { checkPermissions } from "../../utils/permissions";
import "../../styles/Global.css";

const AppointmentsModal = ({
  date,
  appointments,
  setAppointments,
  onClose,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    time: "",
    assignedTo: "",
  });

  const modalRef = useRef();
  
  // Get permissions
  const { canAdd, canEdit, canDelete, canView } = checkPermissions();

  useEffect(() => {
    // Fetch users when component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contactusers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

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
    if (!canAdd) return;
    const newAppointment = {
      id: Date.now(),
      ...formData,
      date,
    };
    setAppointments((prev) => [...prev, newAppointment]);
    resetForm();
  };

  const handleEdit = (appointment) => {
    if (!canEdit) return;
    setEditingId(appointment.id);
    setFormData({ ...appointment });
    setShowForm(true);
  };

  const handleSaveEdit = () => {
    if (!canEdit) return;
    const updated = appointments.map((app) =>
      app.id === editingId ? { ...formData, id: editingId, date } : app
    );
    setAppointments(updated);
    resetForm();
  };

  const handleDelete = (id) => {
    if (!canDelete) return;
    const updated = appointments.filter((app) => app.id !== id);
    setAppointments(updated);
  };

  const appointmentsForDate = appointments.filter((app) => app.date === date);

  if (!canView) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay">
        <div className="rounded-lg shadow-lg p-6 w-full max-w-3xl relative bg-white">
          <p className="text-center text-[var(--text)]">
            You don't have permission to view appointments.
          </p>
          <div className="flex justify-center mt-4">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

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
          {!showForm && canAdd && (
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
              className="w-full p-2 border rounded"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullname} ({user.role})
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={editingId ? handleSaveEdit : handleAddAppointment}
                disabled={!canAdd && !canEdit}
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
                  <strong>Assigned To:</strong> {
                    users.find(user => user._id === app.assignedTo)?.fullname || 'Unknown User'
                  } ({users.find(user => user._id === app.assignedTo)?.role || 'Unknown Role'})
                </p>
                {(canEdit || canDelete) && (
                  <div className="flex gap-2 justify-end mt-2">
                    {canEdit && <button onClick={() => handleEdit(app)}>Edit</button>}
                    {canDelete && <button onClick={() => handleDelete(app.id)}>Delete</button>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AppointmentsModal;