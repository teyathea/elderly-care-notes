import NotesFeed from "../models/NotesFeed.js";


const getAllNotesFeed = async (req, res) => {
    try {
        const notes = await NotesFeed.find()
        console.log(notes)
        res.status(200).json(notes)
        
    } catch (error) {
        res.status(500).json({
            message: "Error Fetching notes",
            error: error.message
        })
        
    }
}

const addNote = async (req, res) => {
    try {
        const {title, description, date } = req.body
        const newNote = new NotesFeed({
            title,
            description,
            date
        })
        await newNote.save() // saving to mongodb
        res.status(201).json({
            message: "Note added successfully",
            error: false
        })
    } catch (error) {
        res.status(500).json({
            message: "Error adding notes",
            error: error.message
        })
        
    }
}

export {getAllNotesFeed, addNote}