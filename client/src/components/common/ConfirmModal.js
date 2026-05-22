'use client';
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'danger' // 'danger' or 'primary'
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>
          <p>{message}</p>
        </div>
        <div className={styles.footer}>
          <button className="btn btn-outline" onClick={onClose}>
            {cancelLabel}
          </button>
          <button 
            className={`btn ${type === 'danger' ? styles.btnDanger : 'btn-primary'}`} 
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
