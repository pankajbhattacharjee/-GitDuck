import styles from "../app/page.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <span className={styles.headerDuck}>🦆</span>
        <span className={styles.headerTitle}>
          Git<span>Duck</span>
        </span>
      </div>
      <span className={styles.headerBadge}>online</span>
    </header>
  );
}
