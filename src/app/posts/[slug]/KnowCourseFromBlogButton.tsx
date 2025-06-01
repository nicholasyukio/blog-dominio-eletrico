"use client";
import styles from './page.module.css';

export function KnowCourseFromBlogButton() {
  const handleClick = () => {
    window.location.href = 'https://dominioeletrico.com.br';
  };

  return (
    <button className={styles.btnInscricao} onClick={handleClick}>
      Começar a estudar gratuitamente
    </button>
  );
}
