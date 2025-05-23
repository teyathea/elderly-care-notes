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


// const getUserNotes = async (req, res) => {
//     try {
//         const userId = req.user.id 
//         const notes = await NotesFeed.find({ created_by : userId }).populate('created_by', 'fullname email')
        
//         res.status(200).json(notes)
//     } catch ( error ) {
//         res.status(500).json({message: "Error fetching notes"})
//         }
// }

// const getAllNotesFeed = async (req, res) => {
//   try {
//     // If you want *only* the notes this user created:
//     const userId = req.user?.id;
//     const notes = userId
//       ? await NotesFeed.find({ createdBy: userId })
//       : await NotesFeed.find().populate("createdBy", "username");

//     res.status(200).json(notes);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching notes", error: error.message });
//   }
// };

const addNote = async (req, res) => {
    try {
        const {title, description} = req.body

        const userId = req.user.id // get user id from JWT token
        const userType = req.user.userType // get user type from JWT token

        const newNote = new NotesFeed({
            title,
            description,
            date: Date.now(),
            created_by: userId,
            creatorModel: userType

        })
        const savedNote = await newNote.save() // saving to mongodb
        res.status(201).json({
            message: "Note added successfully",
            error: false,
            data: savedNote // returning the saved note
        })
    } catch (error) {
        res.status(500).json({
            message: "Error adding notes",
            error: error.message
        })
        
    }
}

const deleteNote = async (req, res) => {
    try {
        const note = await NotesFeed.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        // // only the owner can delete
        // if (note.createdBy.toString() !== req.user.id) {
        //     return res.status(403).json({ message: "Not allowed" });
        // }

        await note.deleteOne();
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting note", error: error.message });
    }
};

const updateNote = async (req, res) => {
    try {
        const noteId = req.params.id; // get note id from users request
        const { title, description } = req.body; // 

        const updatedNote = await NotesFeed.findByIdAndUpdate(noteId, {title, description, date: Date.now()}, {new: true});

        if (!updatedNote){
            return res.status(404).json({message: "Note not found"})
        }

        res.status(200).json({
            message: "Note updated successfully",
            error: false,
            data: updatedNote
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating note",
            error: error.message
        });
    }
}


export {getAllNotesFeed, addNote, deleteNote, updateNote, } //getUserNotes