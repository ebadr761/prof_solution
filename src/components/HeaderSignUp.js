import React from "react";
import { NavLink } from "react-router-dom";
import styles from './Header.module.css';

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img 
            src="/images/logo.jpg" 
            alt="LMS Logo" 
            className={styles.logo}
          />
        </div>
        <h1>LMS - Learning Management System</h1>
      </header>
      
      <nav className={styles.navLinks}>
        <NavLink to="/">Homepage</NavLink>
      </nav>
    </>
  );
};

export default Header;
