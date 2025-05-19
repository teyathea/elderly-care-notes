import { useContext, useState } from "react";
import "../styles/Global.css";
import NoteModal from "./modals/NoteModal"; 
import { NotesContext } from "../context/NotesContext";
import { ACTION_TYPES } from "../action-types/actionTypes";

const NotesFeed = () => {
  const {state, dispatch, addNotesToDb} = useContext(NotesContext)
  const { isEdit, currentNote, showModal, notes} = state
  // const [showModal, setShowModal] = useState(false);
  // const [isEdit, setIsEdit] = useState(false);

  // const [currentNote, setCurrentNote] = useState({
  //   id: null,
  //   title: "",
  //   description: "",
  // });

  // Open Add Note Modal
  const handleAddClick = () => {
    dispatch({type: ACTION_TYPES.SET_IS_EDIT, payload: false})
    dispatch({type: ACTION_TYPES.SET_CURRENT_NOTE, payload: {_id: null, title: "", description: ""} });
    dispatch({ type: ACTION_TYPES.SET_MODAL_VISIBILITY, payload: true})
  };

  // Open Edit Note Modal
  const handleNoteClick = (note) => {
    // console.log("add button")
    dispatch({type: ACTION_TYPES.SET_IS_EDIT, payload: true})
    dispatch({type: ACTION_TYPES.SET_CURRENT_NOTE, payload: note });
    dispatch({ type: ACTION_TYPES.SET_MODAL_VISIBILITY, payload: true})
  };

  // Save Note (Add or Update)
  const handleSave = async () => {
  // Validate the note data and prevent empty notes
    if (!currentNote.title.trim() || !currentNote.description.trim()) {
        alert("please add title and description")
      return
    }

  try {
    if (isEdit) {
    dispatch({ type: ACTION_TYPES.UPDATE_NOTE, data: currentNote })// Update an existing note
  } else {
    await addNotesToDb({ ...currentNote})// Add a new note
  }
    // dispatch({ type: ACTION_TYPES.SET_CURRENT_NOTE, payload: { id: null, title: "", description: "" } });   // Reset currentNote to empty so modal/input are cleared

    dispatch({ type: ACTION_TYPES.SET_MODAL_VISIBILITY, payload: false})

  } catch (error) {
    console.error("failed to save a new note:", error)
  }
}

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
              key={note._id || `temp-${Date.now()}-${Math.random()}`}
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
          setCurrentNote={(note) => dispatch({ type: ACTION_TYPES.SET_CURRENT_NOTE, payload: note})}
          onSave={handleSave}
          onClose={() => dispatch({ type: ACTION_TYPES.SET_MODAL_VISIBILITY, payload: false})}
        />
      )}
    </div>
  );
};

export default NotesFeed;