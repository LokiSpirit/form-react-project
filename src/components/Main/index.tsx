import React from 'react';
import styles from './main.module.css';
import { CustomLink } from '../CustomLink';

const Main: React.FC = () => {
  return (
    <main className={styles.main}>
      <nav className={styles.mainNav}>
        <CustomLink to="form">Form</CustomLink>
        <CustomLink to="rform">React Form</CustomLink>
      </nav>
    </main>
  );
};

export default Main;
