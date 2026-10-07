export default function NoteCard({ note, onEdit, onDelete, onClick }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(note);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(note);
  };

  return (
    <div className="note-card" onClick={() => onClick(note)}>
      <h3 className="note-card__title">{note.title}</h3>
      <p className="note-card__content">{note.content}</p>
      <div className="note-card__footer">
        <span className="note-card__date">{formatDate(note.updatedAt)}</span>
        <div className="note-card__actions">
          <button
            className="note-card__action-btn"
            onClick={handleEdit}
            title="Edit note"
          >
            ✎
          </button>
          <button
            className="note-card__action-btn note-card__action-btn--delete"
            onClick={handleDelete}
            title="Delete note"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
