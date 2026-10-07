export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, note, loading }) {
  if (!isOpen || !note) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="modal__body">
          <div className="confirm-dialog">
            <div className="confirm-dialog__icon">🗑</div>
            <h2 className="confirm-dialog__title">Delete Note</h2>
            <p className="confirm-dialog__message">
              Are you sure you want to delete &ldquo;{note.title}&rdquo;? This action
              cannot be undone.
            </p>
            <div className="confirm-dialog__actions">
              <button className="btn btn--secondary btn--lg" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn--lg"
                style={{
                  backgroundColor: 'var(--color-danger)',
                  color: 'white',
                }}
                onClick={() => onConfirm(note._id)}
                disabled={loading}
              >
                {loading ? <div className="spinner spinner--white" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
