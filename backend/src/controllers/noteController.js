import { validationResult } from 'express-validator';
import Note from '../models/Note.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * @route   GET /api/notes
 * @desc    Get all notes for the authenticated user
 * @access  Private
 */
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/notes/:id
 * @desc    Get a single note by ID (must belong to the user)
 * @access  Private
 */
const getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    // Ensure note belongs to the authenticated user
    if (note.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to access this note', 403);
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @access  Private
 */
const createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((e) => e.msg);
      throw new AppError(messages.join('. '), 400);
    }

    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note (must belong to the user)
 * @access  Private
 */
const updateNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((e) => e.msg);
      throw new AppError(messages.join('. '), 400);
    }

    let note = await Note.findById(req.params.id);

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    // Ensure note belongs to the authenticated user
    if (note.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to update this note', 403);
    }

    const { title, content } = req.body;
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note (must belong to the user)
 * @access  Private
 */
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    // Ensure note belongs to the authenticated user
    if (note.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to delete this note', 403);
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { getNotes, getNote, createNote, updateNote, deleteNote };
