import { Outlet } from 'react-router-dom';
import styles from './layout.module.css';

const Layout: React.FC = () => {
  return (
    <div className={styles.layoutContainer}>
      <Outlet />
    </div>
  );
};

export default Layout;
