import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/dashboard/stats');
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
        }
    }
);

const initialState = {
    stats: {
        users: { total: 0 },
        blogs: { total: 0, published: 0 },
        clubs: { total: 0 },
        programs: { total: 0 },
        messages: { total: 0, unread: 0 },
        gallery: { total: 0 },
    },
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
