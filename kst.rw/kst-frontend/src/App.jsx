import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CinematicCursor from './components/shared/CinematicCursor';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramListPage from './pages/ProgramListPage';
import BlogListPage from './pages/Blogs/BlogListPage';
import BlogDetailPage from './pages/Blogs/BlogDetailPage';
import ClubListPage from './pages/Clubs/ClubListPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <CinematicCursor />
      <div className="grain" />
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramListPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/clubs" element={<ClubListPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
