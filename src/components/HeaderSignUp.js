import React from "react";
import { NavLink } from "react-router-dom";
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img 
          src="/images/logo.jpg" 
          alt="LMS Logo" 
          className={styles.logo}
        />
        <h1 className={styles.title}>LMS — Learning Management System</h1>
      </div>
      
      <nav className={styles.navCenter}>
        <NavLink to="/" className={styles.navLink}>
          Homepage
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;