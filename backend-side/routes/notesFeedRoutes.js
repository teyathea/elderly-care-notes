import express from 'express'; // for routing
import { getAllNotesFeed, addNote, deleteNote, updateNote } from '../controller/notesFeedController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router()

// router.get('/allnotes', authMiddleware, getAllNotesFeed) //getAllNotesFeed is from controller

// router.post('/addnote', authMiddleware, addNote) // addd notes

// router.delete('/delete/:id', authMiddleware, deleteNote) // delete notes

router.get('/allnotes', getAllNotesFeed) //getAllNotesFeed is from controller

router.post('/addnote', addNote) // addd notes

router.delete('/delete/:id', deleteNote) // delete notes

router.put('/update/:id', updateNote) // update notes


export default router