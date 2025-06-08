// src/components/NavBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function NavBar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.links}>
        <NavLink to="/" style={styles.link}>Home</NavLink>
        <NavLink to="/sorting" style={styles.link}>Sorting</NavLink>
        <NavLink to="/searching" style={styles.link}>Searching</NavLink>
        <NavLink to="/cpu" style={styles.link}>CPU Scheduling</NavLink>
        <NavLink to="/disk" style={styles.link}>Disk Scheduling</NavLink>
      </div>
      <ThemeToggle />
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#222',
    color: '#fff',
    alignItems: 'center'
  },
  links: {
    display: 'flex',
    gap: '15px'
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    fontWeight: 'bold'
  }
};
