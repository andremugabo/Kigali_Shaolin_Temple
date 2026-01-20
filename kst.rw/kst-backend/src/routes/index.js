const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const heroSlideRoutes = require('./heroSlideRoutes');
const aboutRoutes = require('./aboutRoutes');
const programRoutes = require('./programRoutes');
const blogRoutes = require('./blogRoutes');
const clubRoutes = require('./clubRoutes');
const contactMessageRoutes = require('./contactMessageRoutes');
const galleryRoutes = require('./galleryRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/users', userRoutes);
router.use('/hero-slides', heroSlideRoutes);
router.use('/about', aboutRoutes);
router.use('/programs', programRoutes);
router.use('/blogs', blogRoutes);
router.use('/clubs', clubRoutes);
router.use('/contact-messages', contactMessageRoutes);
router.use('/gallery', galleryRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
