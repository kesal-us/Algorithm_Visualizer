import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SortingPage from './pages/SortingPage';
import SearchingPage from './pages/SearchingPage';
import CpuPage from './pages/cpuPage';
import DiskPage from './pages/DiskPage';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/searching" element={<SearchingPage />} />
        <Route path="/cpu" element={<CpuPage />} />
        <Route path="/disk" element={<DiskPage />} />
      </Routes>
    </Router>
  );
}

export default App;
