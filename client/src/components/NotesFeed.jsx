import { useState } from "react";
import "../styles/Global.css";
import NoteModal from "./modals/NoteModal";

const NotesFeed = () => {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    id: null,
    title: "",
    description: "",
  });

  // Open Add Note Modal
  const handleAddClick = () => {
    setIsEdit(false);
    setCurrentNote({ id: null, title: "", description: "" });
    setShowModal(true);
  };

  // Open Edit Note Modal
  const handleNoteClick = (note) => {
    setIsEdit(true);
    setCurrentNote(note);
    setShowModal(true);
  };

  // Save Note (Add or Update)
  const handleSave = () => {
  // Validate the note data and prevent empty notes
  if (!currentNote.title.trim()) return;

  if (isEdit) {
    // Update an existing note
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === currentNote.id ? currentNote : note
      )
    );
  } else {
    // Add a new note
    const newNote = {
      ...currentNote,
      id: Date.now(),
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
  }

  setShowModal(false);
};

  return (
    <div
      className="p-4 min-h-screen flex flex-col items-center"
      style={{ backgroundColor: "var(--light)" }}
    >
      <div className="w-full max-w-[1000px] flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold pr-170" style={{ color: "var(--primary)" }}>
          Shared Notes
        </h2>
        <button onClick={handleAddClick}>+ Add</button>
      </div>

      <div
        className="w-full rounded-xl p-4"
        style={{
          border: "2px solid var(--accent)",
          backgroundColor: "white",
        }}
      >
        {notes.length === 0 ? (
          <p className="text-center italic text-gray-500">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleNoteClick(note)}
              className="rounded-md p-3 mb-2 cursor-pointer transition duration-200"
              style={{
                backgroundColor: "var(--medium)",
                border: "1px solid var(--accent)",
                color: "white",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--medium)")
              }
            >
              <h4 className="text-lg font-semibold">{note.title}</h4>
              <p className="text-sm mt-1">{note.description}</p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <NoteModal
          isEdit={isEdit}
          currentNote={currentNote}
          setCurrentNote={setCurrentNote}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default NotesFeed;