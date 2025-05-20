import mongoose, { Schema } from "mongoose"; // connection from api backend to database mongodb

const notesfeedSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    // created_by: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'ContactUser', 
    //     required: true
    // }
})

const NotesFeed = mongoose.model('NotesFeed', notesfeedSchema) // model name is NotesFeed

export default NotesFeed