import express from 'express'; // for routing
import { getAllNotesFeed, addNote } from '../controller/notesFeedController.js';

const router = express.Router()

router.get('/allnotes', getAllNotesFeed) //getAllNotesFeed is from controller


router.post('/addnote', addNote) // addd notes

export default router