import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramListPage from './pages/ProgramListPage';
import BlogListPage from './pages/Blogs/BlogListPage';
import ClubListPage from './pages/Clubs/ClubListPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramListPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/clubs" element={<ClubListPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
