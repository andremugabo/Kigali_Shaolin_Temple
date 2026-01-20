import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import blogReducer from './slices/blogSlice';
import clubReducer from './slices/clubSlice';
import programReducer from './slices/programSlice';
import galleryReducer from './slices/gallerySlice';
import userReducer from './slices/userSlice';
import auditLogReducer from './slices/auditLogSlice';
import heroSlideReducer from './slices/heroSlideSlice';
import aboutReducer from './slices/aboutSlice';
import messageReducer from './slices/messageSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        blogs: blogReducer,
        clubs: clubReducer,
        programs: programReducer,
        gallery: galleryReducer,
        users: userReducer,
        auditLogs: auditLogReducer,
        heroSlides: heroSlideReducer,
        about: aboutReducer,
        messages: messageReducer,
    },
});

export default store;
