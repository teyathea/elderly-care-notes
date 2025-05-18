export const initialState = {
    noteData: {
        title: "",
        description: "",
        date: Date.now(),
    },
    notes: [] // storing all notes
}

export function notesReducer(state, action) {
    switch (action.type) {
        case 'ADD_NOTE':
            const {title, description, date} = action.payload

                if (!title || !description) {
                    alert("please add title and description")
                    return state
                }
            return {
                ...state,
                notes: [...state.notes, action.payload] //adding new note to the notes array               
                
            }
            case 'LOAD_NOTES':
                return {
                    ...state,
                    notes: action.data || [] // loading all notes from the database
                }
            default:
                return state
    }
}