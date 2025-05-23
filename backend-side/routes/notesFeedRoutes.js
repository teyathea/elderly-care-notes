import express from 'express'; // for routing
import {getAllNotesFeed, getUserNotesFeed, addNote, deleteNote, updateNote } from '../controller/notesFeedController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router()

router.get('/allusernotes', authMiddleware, getUserNotesFeed) //getAllNotesFeed is from controller

router.get('/allnotes', getAllNotesFeed) //getAllNotesFeed is from controller

router.post('/addnote', authMiddleware, addNote) // addd notes

router.delete('/delete/:id', deleteNote) // delete notes

router.put('/update/:id', updateNote) // update notes


export default router