import React from 'react';
import styles from './main.module.css';
import { CustomLink } from '../CustomLink';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

const Main: React.FC = () => {
  const formData = useAppSelector((store: RootState) => store.selectedFormData.formData);
  return (
    <>
      <nav className={styles.mainNav}>
        <CustomLink to="form">Form</CustomLink>
        <CustomLink to="rform">React Form</CustomLink>
      </nav>
      <main className={styles.main}>
        {formData && (
          <div className={styles.tile}>
            <h2>User Data</h2>
            <p>Name: {formData.name}</p>
            <p>Age: {formData.age}</p>
            <p>Email: {formData.email}</p>
            <p>Gender: {formData.gender}</p>
            <p>Country: {formData.country}</p>
            <img src={formData.picture} alt="Uploaded image" className={styles.picture} />
          </div>
        )}
      </main>
    </>
  );
};

export default Main;
