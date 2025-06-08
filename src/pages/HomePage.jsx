import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

export default function HomePage() {
  return (
    <div className="home">
      <h1>Welcome to Algorithm Visualizer</h1>
      <p>Choose a category to start:</p>
      <div className="home-links">
        <Link to="/sorting">Sorting</Link>
        <Link to="/searching">Searching</Link>
        <Link to="/cpu">CPU Scheduling</Link>
        <Link to="/disk">Disk Scheduling</Link>
      </div>
    </div>
  );
}
