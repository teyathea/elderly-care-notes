import axios from "axios"; // connection from frontend to backend
import { useEffect, createContext, useReducer } from "react";
import { notesReducer, initialState } from "../reducers/notesReducer";
import { ACTION_TYPES } from "../action-types/actionTypes";

export const NotesContext = createContext()

export function NotesProvider({ children }) {
    const [state, dispatch] = useReducer(notesReducer, initialState) // galing notesReducer


useEffect (() => {
    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/notesfeed/allnotes') // get all notes from backend
            console.log("Fetched notes:", response.data); 
            dispatch({
                type: ACTION_TYPES.LOAD_NOTES,
                data: response.data
            })
            
        } catch (error) {
            console.error("Error fetching notes from database", error)
        }
    }
    fetchNotes();
}, [])

const addNotesToDb = async (noteData) => {
    try {
        const response = await axios.post('http:localhose:8000/api/notesfeed/addnote', noteData)
        dispatch({
            type: ACTION_TYPES.ADD_NOTE,
            data: response.data
        })
        console.log("added new note")
        
    } catch (error) {
        console.error("Error adding new note to the database", error)
    }
}



    return (
        <NotesContext.Provider value={{
            state,
            dispatch,
            addNotesToDb

        }}>
            {children}
        </NotesContext.Provider>
    )
}