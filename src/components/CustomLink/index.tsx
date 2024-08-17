import { Link, useMatch } from 'react-router-dom';
import styles from './customLink.module.css';
import { ReactNode } from 'react';
import cn from 'classnames';

export type CustomLinkProps = {
  children: ReactNode;
  id?: string;
  to: string;
  changeSearchCategory?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const CustomLink = ({ children, id, to, changeSearchCategory, ...props }: CustomLinkProps) => {
  const match = useMatch({
    path: to,
    end: to.length === 1,
  });

  return (
    <Link
      id={id}
      onClick={changeSearchCategory}
      className={cn(styles.navLink, match ? styles.active : '')}
      to={to}
      {...props}
    >
      {children}
    </Link>
  );
};

export { CustomLink };
