import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loaderWrapper}>
        <div className={styles.spinner} />
        <span className={styles.brandText}>/Haitham.Store/</span>
      </div>
    </div>
  );
}
