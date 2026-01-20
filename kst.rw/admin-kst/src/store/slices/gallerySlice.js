import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchGallery = createAsyncThunk(
    'gallery/fetchAll',
    async ({ page = 1, limit = 12, category = '', mediaType = '' }, { rejectWithValue }) => {
        try {
            let url = `/gallery?page=${page}&limit=${limit}`;
            if (category) url += `&category=${category}`;
            if (mediaType) url += `&mediaType=${mediaType}`;

            const response = await apiClient.get(url);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch gallery');
        }
    }
);

export const uploadMedia = createAsyncThunk(
    'gallery/upload',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload media');
        }
    }
);

export const updateMedia = createAsyncThunk(
    'gallery/update',
    async ({ id, metadata }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/gallery/${id}`, metadata);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update media');
        }
    }
);

export const deleteMedia = createAsyncThunk(
    'gallery/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/gallery/${id}`);
            if (response.data.success) {
                return id;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete media');
        }
    }
);

const initialState = {
    items: [],
    pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
    },
    loading: false,
    submitting: false,
    error: null,
};

const gallerySlice = createSlice({
    name: 'gallery',
    initialState,
    reducers: {
        clearGalleryError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchGallery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGallery.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchGallery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Upload
            .addCase(uploadMedia.pending, (state) => {
                state.submitting = true;
            })
            .addCase(uploadMedia.fulfilled, (state, action) => {
                state.submitting = false;
                state.items.unshift(action.payload);
            })
            .addCase(uploadMedia.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateMedia.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteMedia.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export const { clearGalleryError } = gallerySlice.actions;
export default gallerySlice.reducer;
