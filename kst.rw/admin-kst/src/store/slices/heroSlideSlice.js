import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchHeroSlides = createAsyncThunk(
    'heroSlides/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/hero-slides');
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch slides');
        }
    }
);

export const createHeroSlide = createAsyncThunk(
    'heroSlides/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/hero-slides', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create slide');
        }
    }
);

export const updateHeroSlide = createAsyncThunk(
    'heroSlides/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/hero-slides/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update slide');
        }
    }
);

export const deleteHeroSlide = createAsyncThunk(
    'heroSlides/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/hero-slides/${id}`);
            if (response.data.success) {
                return id;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete slide');
        }
    }
);

const initialState = {
    slides: [],
    loading: false,
    submitting: false,
    error: null,
};

const heroSlideSlice = createSlice({
    name: 'heroSlides',
    initialState,
    reducers: {
        clearHeroError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchHeroSlides.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHeroSlides.fulfilled, (state, action) => {
                state.loading = false;
                state.slides = action.payload;
            })
            .addCase(fetchHeroSlides.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createHeroSlide.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createHeroSlide.fulfilled, (state, action) => {
                state.submitting = false;
                state.slides.push(action.payload);
            })
            .addCase(createHeroSlide.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateHeroSlide.pending, (state) => {
                state.submitting = true;
            })
            .addCase(updateHeroSlide.fulfilled, (state, action) => {
                state.submitting = false;
                const index = state.slides.findIndex((s) => s.id === action.payload.id);
                if (index !== -1) {
                    state.slides[index] = action.payload;
                }
            })
            .addCase(updateHeroSlide.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteHeroSlide.fulfilled, (state, action) => {
                state.slides = state.slides.filter((s) => s.id !== action.payload);
            });
    },
});

export const { clearHeroError } = heroSlideSlice.actions;
export default heroSlideSlice.reducer;
