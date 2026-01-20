import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchAbout = createAsyncThunk(
    'about/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/about');
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch about content');
        }
    }
);

export const createAbout = createAsyncThunk(
    'about/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/about', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create about content');
        }
    }
);

export const updateAbout = createAsyncThunk(
    'about/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/about/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update about content');
        }
    }
);

const initialState = {
    about: null,
    loading: false,
    submitting: false,
    error: null,
};

const aboutSlice = createSlice({
    name: 'about',
    initialState,
    reducers: {
        clearAboutError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAbout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAbout.fulfilled, (state, action) => {
                state.loading = false;
                state.about = action.payload;
            })
            .addCase(fetchAbout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAbout.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createAbout.fulfilled, (state, action) => {
                state.submitting = false;
                state.about = action.payload;
            })
            .addCase(createAbout.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            .addCase(updateAbout.pending, (state) => {
                state.submitting = true;
            })
            .addCase(updateAbout.fulfilled, (state, action) => {
                state.submitting = false;
                state.about = action.payload;
            })
            .addCase(updateAbout.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });
    },
});

export const { clearAboutError } = aboutSlice.actions;
export default aboutSlice.reducer;
