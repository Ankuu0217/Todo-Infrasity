import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { noteService } from '../services/noteService';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [viewNote, setViewNote] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      const result = await noteService.getNotes();
      setNotes(result.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Search / filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredNotes(
        notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, notes]);

  // Handlers
  const handleCreate = () => {
    setSelectedNote(null);
    setNoteModalOpen(true);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setNoteModalOpen(true);
  };

  const handleDeletePrompt = (note) => {
    setSelectedNote(note);
    setDeleteModalOpen(true);
  };

  const handleViewNote = (note) => {
    setViewNote(note);
  };

  const handleNoteSubmit = async ({ title, content }) => {
    setActionLoading(true);
    try {
      if (selectedNote) {
        await noteService.updateNote(selectedNote._id, title, content);
        toast.success('Note updated');
      } else {
        await noteService.createNote(title, content);
        toast.success('Note created');
      }
      setNoteModalOpen(false);
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async (noteId) => {
    setActionLoading(true);
    try {
      await noteService.deleteNote(noteId);
      toast.success('Note deleted');
      setDeleteModalOpen(false);
      setSelectedNote(null);
      if (viewNote && viewNote._id === noteId) {
        setViewNote(null);
      }
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete note');
    } finally {
      setActionLoading(false);
    }
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Detail view
  if (viewNote) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="note-detail">
          <button
            className="note-detail__back"
            onClick={() => setViewNote(null)}
          >
            ← All Notes
          </button>
          <div className="note-detail__card">
            <h1 className="note-detail__title">{viewNote.title}</h1>
            <p className="note-detail__meta">
              Last updated {formatFullDate(viewNote.updatedAt)}
            </p>
            <div className="note-detail__content">{viewNote.content}</div>
            <div className="note-detail__actions">
              <button
                className="btn btn--primary"
                onClick={() => handleEdit(viewNote)}
              >
                Edit Note
              </button>
              <button
                className="btn btn--danger"
                onClick={() => handleDeletePrompt(viewNote)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <NoteModal
          isOpen={noteModalOpen}
          onClose={() => setNoteModalOpen(false)}
          onSubmit={handleNoteSubmit}
          note={selectedNote}
          loading={actionLoading}
        />

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedNote(null);
          }}
          onConfirm={handleDeleteConfirm}
          note={selectedNote}
          loading={actionLoading}
        />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard__content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-header__greeting">
              {getGreeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="dashboard-header__meta">
              {notes.length === 0
                ? 'Create your first note to get started'
                : `${notes.length} note${notes.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button className="btn btn--primary btn--lg" onClick={handleCreate}>
            + New Note
          </button>
        </div>

        {notes.length > 0 && (
          <div className="search-bar">
            <span className="search-bar__icon">⌕</span>
            <input
              className="search-bar__input"
              type="text"
              placeholder="Search notes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {loading ? (
          <div className="page-loader">
            <div className="spinner" />
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📝</div>
            <h2 className="empty-state__title">No notes yet</h2>
            <p className="empty-state__description">
              Your notes will appear here. Create your first note to start
              organizing your thoughts.
            </p>
            <button
              className="btn btn--primary btn--lg"
              onClick={handleCreate}
            >
              Create Your First Note
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <h2 className="empty-state__title">No results</h2>
            <p className="empty-state__description">
              No notes match &ldquo;{searchQuery}&rdquo;. Try a different search term.
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note, index) => (
              <div
                key={note._id}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <NoteCard
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDeletePrompt}
                  onClick={handleViewNote}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSubmit={handleNoteSubmit}
        note={selectedNote}
        loading={actionLoading}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedNote(null);
        }}
        onConfirm={handleDeleteConfirm}
        note={selectedNote}
        loading={actionLoading}
      />
    </div>
  );
}
