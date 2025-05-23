import { useContext, useState, useEffect } from "react";
import "../styles/Global.css";
import NoteModal from "./modals/NoteModal"; 
import { NotesContext } from "../context/NotesContext";
import { ACTION_TYPES } from "../action-types/actionTypes";

const NotesFeed = () => {
  const {state, dispatch, addNotesToDb, deleteNotesToDb, updateNoteInDb, capitalizeSentence} = useContext(NotesContext)
  const { isEdit, currentNote, showModal, notes} = state

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
      if (currentNote._id) {
        await updateNoteInDb( currentNote)
      } else {
        await addNotesToDb({ ...currentNote })// Add a new note
      }
      dispatch({ type: ACTION_TYPES.SET_MODAL_VISIBILITY, payload: false })
    } catch (error) {
      console.error("failed to save a new note:", error)
    }
  }

  const handleDelete = async (noteId) => {
    try {
      await deleteNotesToDb(noteId)
      
    } catch (error) {
      console.error("Error deleting notes in NotesFeed", error)
    }
  }

  return (
    <div
      className="p-4 min-h-screen flex flex-col items-center"
    >
      <div className="w-full max-w-[1000px] flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold pr-170" style={{ color: "var(--primary)" }}>
          Shared Notes
        </h2>
        <button onClick={handleAddClick}>Add</button> 
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
              key={note._id || `temp-${Date.now()}-${Math.random()}`} // unique key
              className="rounded-md p-3 mb-2 cursor-pointer transition duration-200 flex justify-between items-start"
              style={{
                backgroundColor: "var(--medium)",
                border: "1px solid var(--accent)",
                color: "white",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--medium)")}
            >

              <div className="flex-1" onClick={() => handleNoteClick(note)}>
                <small>{new Date(note.date).toLocaleString()}</small>

                <h4 className="text-lg font-semibold capitalize">{note.title}</h4>
                <p className="text-sm mt-1">{capitalizeSentence(note.description)}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevents triggering the note click event
                  if(window.confirm("Are you sure you want to delete?")){
                    handleDelete(note._id);
                  }
                }}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
              >
                Delete
              </button>
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