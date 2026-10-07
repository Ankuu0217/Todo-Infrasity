import { useState, useEffect } from 'react';

export default function NoteModal({ isOpen, onClose, onSubmit, note, loading }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  const isEditing = !!note;

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
    setErrors({});
  }, [note, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (title.trim().length > 200)
      newErrors.title = 'Title cannot exceed 200 characters';
    if (!content.trim()) newErrors.content = 'Content is required';
    if (content.trim().length > 10000)
      newErrors.content = 'Content cannot exceed 10000 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title: title.trim(), content: content.trim() });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">
            {isEditing ? 'Edit Note' : 'New Note'}
          </h2>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="modal__form">
              <div className="form-group">
                <label className="form-label" htmlFor="note-title">
                  Title
                </label>
                <input
                  id="note-title"
                  className="form-input"
                  type="text"
                  placeholder="Give your note a title…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
                {errors.title && (
                  <span className="form-error">{errors.title}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="note-content">
                  Content
                </label>
                <textarea
                  id="note-content"
                  className="form-input form-input--textarea"
                  placeholder="Write your thoughts…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                {errors.content && (
                  <span className="form-error">{errors.content}</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner spinner--white" />
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Note'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
