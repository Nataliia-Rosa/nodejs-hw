import { Note } from '../models/note.js';
import { buildNoteFilter } from '../utils/buildNoteFilter.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllNotes = async ({ page, perPage, tag, search }) => {
  const filter = buildNoteFilter({ tag, search });
  const skip = (page - 1) * perPage;

  const notesQuery = Note.find(filter).skip(skip).limit(perPage);

  if (search && search.trim()) {
    notesQuery.sort({ score: { $meta: 'textScore' } });
  } else {
    notesQuery.sort({ createdAt: -1 });
  }

  const [notes, totalNotes] = await Promise.all([
    notesQuery.exec(),
    Note.countDocuments(filter),
  ]);

  return {
    page,
    perPage,
    totalNotes,
    totalPages: calculatePaginationData(totalNotes, perPage),
    notes,
  };
};

export const getNoteById = async (noteId) => {
  return Note.findById(noteId);
};

export const createNote = async (payload) => {
  return Note.create(payload);
};

export const updateNote = async (noteId, payload) => {
  return Note.findByIdAndUpdate(noteId, payload, {
    new: true,
    runValidators: true,
  });
};

export const deleteNote = async (noteId) => {
  return Note.findByIdAndDelete(noteId);
};
