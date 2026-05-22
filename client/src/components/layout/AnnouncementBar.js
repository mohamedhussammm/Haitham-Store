'use client';
import { useState } from 'react';
import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.content}>
        <span>FREE SHIPPING on orders above <strong>30 JOD</strong></span>
      </div>
      <button className={styles.close} onClick={() => setIsVisible(false)} aria-label="Close announcement">
        ✕
      </button>
    </div>
  );
}
