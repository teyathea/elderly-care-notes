import { useContext, useEffect } from "react";
import "../styles/Global.css";
import NoteModal from "./modals/NoteModal"; 
import { NotesContext } from "../context/NotesContext";
import { ACTION_TYPES } from "../action-types/actionTypes";
import { checkPermissions } from '../utils/permissions';

const NotesFeed = () => {
  const { state, dispatch, addNotesToDb, deleteNotesToDb, updateNoteInDb, capitalizeSentence, fetchUserNotes } = useContext(NotesContext);
  const { isEdit, currentNote, showModal, notes } = state;
  const { canAdd, canEdit, canDelete } = checkPermissions();

  // Listen for permission changes
  useEffect(() => {
    const handlePermissionChange = () => {
      console.log("Permissions changed, refreshing notes...");
      fetchUserNotes();
    };

    window.addEventListener('permissionsChanged', handlePermissionChange);

    return () => {
      window.removeEventListener('permissionsChanged', handlePermissionChange);
    };
  }, [fetchUserNotes]);

  // Open Add Note Modal
  const handleAddClick = () => {
    if (!canAdd) {
      alert("You don't have permission to add notes");
      return;
    }
    dispatch({type: ACTION_TYPES.SET_IS_EDIT, payload: false});
    dispatch({type: ACTION_TYPES.SET_CURRENT_NOTE, payload: {_id: null, title: "", description: ""} });
    dispatch({ type: ACTION_TYPES.SET_MODAL_VISIBILITY, payload: true});
  };

  // Open Edit Note Modal
  const handleNoteClick = (note) => {
    if (!canEdit) {
      return; // Just view the note, don't open edit modal
    }
    dispatch({type: ACTION_TYPES.SET_IS_EDIT, payload: true});
    dispatch({type: ACTION_TYPES.SET_CURRENT_NOTE, payload: note });
    dispatch({ type: ACTION_TYPES.SET_MODAL_VISIBILITY, payload: true});
  };

  // Save Note (Add or Update)
  const handleSave = async () => {
    // Validate the note data and prevent empty notes
    if (!currentNote.title.trim() || !currentNote.description.trim()) {
      alert("Please add title and description");
      return;
    }

    try {
      if (currentNote._id) {
        if (!canEdit) {
          alert("You don't have permission to edit notes");
          return;
        }
        await updateNoteInDb(currentNote);
      } else {
        if (!canAdd) {
          alert("You don't have permission to add notes");
          return;
        }
        await addNotesToDb({ ...currentNote });
      }
      dispatch({ type: ACTION_TYPES.SET_MODAL_VISIBILITY, payload: false });
    } catch (error) {
      console.error("Failed to save note:", error);
      alert(error.response?.data?.message || "Failed to save note");
    }
  };

  const handleDelete = async (noteId) => {
    if (!canDelete) {
      alert("You don't have permission to delete notes");
      return;
    }

    try {
      if (window.confirm("Are you sure you want to delete this note?")) {
        await deleteNotesToDb(noteId);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert(error.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div className="p-4 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[1000px] flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold pr-170" style={{ color: "var(--primary)" }}>
          Shared Notes
        </h2>
        {canAdd && (
          <button 
            onClick={handleAddClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add Note
          </button>
        )}
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
          [...notes].sort((a,b) => new Date(b.date) - new Date(a.date)).map((note) => (
            <div
              key={note._id || `temp-${Date.now()}-${Math.random()}`}
              className={`rounded-md p-3 mb-2 transition duration-200 flex justify-between items-start ${canEdit ? 'cursor-pointer' : ''}`}
              style={{
                backgroundColor: "var(--medium)",
                border: "1px solid var(--accent)",
                color: "white",
              }}
              onMouseEnter={(e) => canEdit && (e.currentTarget.style.backgroundColor = "var(--secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--medium)")}
            >
              <div className="flex-1" onClick={() => handleNoteClick(note)}>
                <div className="flex justify-between items-center mb-1">
                  <small>{new Date(note.date).toLocaleString()}</small>
                  {note.created_by && (
                    <small className="text-blue-200">
                      By: {note.created_by.fullname}
                    </small>
                  )}
                </div>
                <h4 className="text-lg font-semibold capitalize">{note.title}</h4>
                <p className="text-sm mt-1">{capitalizeSentence(note.description)}</p>
              </div>

              {canDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(note._id);
                  }}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                >
                  Delete
                </button>
              )}
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