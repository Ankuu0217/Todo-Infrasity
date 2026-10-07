import express from 'express';
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';
import {
  noteValidation,
  noteUpdateValidation,
} from '../middleware/validators.js';

const router = express.Router();

// All note routes are protected
router.use(protect);

router.route('/').get(getNotes).post(noteValidation, createNote);

router
  .route('/:id')
  .get(getNote)
  .put(noteUpdateValidation, updateNote)
  .delete(deleteNote);

export default router;
