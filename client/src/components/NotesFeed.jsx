import React, { useState } from 'react';
import '../styles/NotesFeed.css';

const NotesFeed = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Doctor Visit', description: 'Follow-up with cardiologist' },
    { id: 2, title: 'Medication Reminder', description: 'Aspirin every 8 AM' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', description: '' });

  // Open Add Note Modal
  const handleAddClick = () => {
    setIsEdit(false);
    setCurrentNote({ id: null, title: '', description: '' });
    setShowModal(true);
  };

  // Open Edit Note Modal
  const handleNoteClick = (note) => {
    setIsEdit(true);
    setCurrentNote(note);
    setShowModal(true);
  };

  // Handle Save (add or update)
  const handleSave = () => {
    if (isEdit) {
      setNotes(prev =>
        prev.map(note => note.id === currentNote.id ? currentNote : note)
      );
    } else {
      const newNote = {
        ...currentNote,
        id: Date.now(),
      };
      setNotes(prev => [...prev, newNote]);
    }
    setShowModal(false);
  };

  return (
    <div className="notes-feed-container">
      <div className="notes-header">
        <h2>Shared Notes</h2>
        <button onClick={handleAddClick} className="add-btn">+ Add</button>
      </div>

      <div className="notes-box">
        {notes.map(note => (
          <div key={note.id} className="note-card" onClick={() => handleNoteClick(note)}>
            <h4>{note.title}</h4>
            <p>{note.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{isEdit ? 'Edit Note' : 'Add Note'}</h3>
            <input
              type="text"
              placeholder="Title"
              value={currentNote.title}
              onChange={e => setCurrentNote({ ...currentNote, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={currentNote.description}
              onChange={e => setCurrentNote({ ...currentNote, description: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleSave}>{isEdit ? 'Update' : 'Save'}</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesFeed;