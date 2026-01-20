import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// --- Club Thunks ---
export const fetchClubs = createAsyncThunk(
    'clubs/fetchAll',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/clubs?page=${page}&limit=${limit}`);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch clubs');
        }
    }
);

export const createClub = createAsyncThunk(
    'clubs/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/clubs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create club');
        }
    }
);

export const updateClub = createAsyncThunk(
    'clubs/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/clubs/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update club');
        }
    }
);

export const deleteClub = createAsyncThunk(
    'clubs/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/clubs/${id}`);
            if (response.data.success) {
                return id;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete club');
        }
    }
);

// --- Tutorial Thunks ---
export const fetchTutorials = createAsyncThunk(
    'clubs/fetchTutorials',
    async (clubId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/clubs/${clubId}/tutorials`);
            if (response.data.success) {
                return { clubId, tutorials: response.data.data };
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tutorials');
        }
    }
);

export const addTutorial = createAsyncThunk(
    'clubs/addTutorial',
    async ({ clubId, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/clubs/${clubId}/tutorials`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return { clubId, tutorial: response.data.data };
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add tutorial');
        }
    }
);

export const removeTutorial = createAsyncThunk(
    'clubs/removeTutorial',
    async ({ clubId, tutorialId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/clubs/tutorials/${tutorialId}`);
            if (response.data.success) {
                return { clubId, tutorialId };
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove tutorial');
        }
    }
);

const initialState = {
    clubs: [],
    tutorials: {}, // Map of clubId -> tutorials array
    pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
    },
    loading: false,
    submitting: false,
    error: null,
};

const clubSlice = createSlice({
    name: 'clubs',
    initialState,
    reducers: {
        clearClubError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Clubs
            .addCase(fetchClubs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClubs.fulfilled, (state, action) => {
                state.loading = false;
                state.clubs = action.payload.clubs;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchClubs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Club
            .addCase(createClub.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createClub.fulfilled, (state, action) => {
                state.submitting = false;
                state.clubs.unshift(action.payload);
            })
            .addCase(createClub.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Update Club
            .addCase(updateClub.fulfilled, (state, action) => {
                const index = state.clubs.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.clubs[index] = action.payload;
                }
            })
            // Delete Club
            .addCase(deleteClub.fulfilled, (state, action) => {
                state.clubs = state.clubs.filter((c) => c.id !== action.payload);
            })
            // Fetch Tutorials
            .addCase(fetchTutorials.fulfilled, (state, action) => {
                state.tutorials[action.payload.clubId] = action.payload.tutorials;
            })
            // Add Tutorial
            .addCase(addTutorial.fulfilled, (state, action) => {
                if (!state.tutorials[action.payload.clubId]) {
                    state.tutorials[action.payload.clubId] = [];
                }
                state.tutorials[action.payload.clubId].push(action.payload.tutorial);
            })
            // Remove Tutorial
            .addCase(removeTutorial.fulfilled, (state, action) => {
                if (state.tutorials[action.payload.clubId]) {
                    state.tutorials[action.payload.clubId] = state.tutorials[action.payload.clubId].filter(
                        (t) => t.id !== action.payload.tutorialId
                    );
                }
            });
    },
});

export const { clearClubError } = clubSlice.actions;
export default clubSlice.reducer;
