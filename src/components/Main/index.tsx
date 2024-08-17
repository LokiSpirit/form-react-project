import React from 'react';
import styles from './main.module.css';
import { CustomLink } from '../CustomLink';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import cn from 'classnames';

const Main: React.FC = () => {
  const formData = useAppSelector((store: RootState) => store.selectedFormData.formData);
  return (
    <>
      <nav className={styles.mainNav}>
        <CustomLink to="form">Form</CustomLink>
        <CustomLink to="rform">React Form</CustomLink>
      </nav>
      <main className={styles.main}>
        <div className={styles.tilesContainer}>
          {!!formData.length &&
            formData.map((data, index) => (
              <div key={index} className={cn(styles.tile, index === 0 ? styles.active : '')}>
                <h2>User Data</h2>
                <p>Name: {data.name}</p>
                <p>Age: {data.age}</p>
                <p>Email: {data.email}</p>
                <p>Gender: {data.gender}</p>
                <p>Country: {data.country}</p>
                <img src={data.picture} alt="Uploaded image" className={styles.picture} />
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

export default Main;
