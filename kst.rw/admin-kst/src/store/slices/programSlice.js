import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchPrograms = createAsyncThunk(
    'programs/fetchAll',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/programs?page=${page}&limit=${limit}`);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch programs');
        }
    }
);

export const createProgram = createAsyncThunk(
    'programs/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/programs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create program');
        }
    }
);

export const updateProgram = createAsyncThunk(
    'programs/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/programs/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update program');
        }
    }
);

export const deleteProgram = createAsyncThunk(
    'programs/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/programs/${id}`);
            if (response.data.success) {
                return id;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete program');
        }
    }
);

const initialState = {
    programs: [],
    pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
    },
    loading: false,
    submitting: false,
    error: null,
};

const programSlice = createSlice({
    name: 'programs',
    initialState,
    reducers: {
        clearProgramError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchPrograms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrograms.fulfilled, (state, action) => {
                state.loading = false;
                state.programs = action.payload.programs;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchPrograms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createProgram.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createProgram.fulfilled, (state, action) => {
                state.submitting = false;
                state.programs.unshift(action.payload);
            })
            .addCase(createProgram.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateProgram.pending, (state) => {
                state.submitting = true;
            })
            .addCase(updateProgram.fulfilled, (state, action) => {
                state.submitting = false;
                const index = state.programs.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.programs[index] = action.payload;
                }
            })
            .addCase(updateProgram.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteProgram.fulfilled, (state, action) => {
                state.programs = state.programs.filter((p) => p.id !== action.payload);
            });
    },
});

export const { clearProgramError } = programSlice.actions;
export default programSlice.reducer;
