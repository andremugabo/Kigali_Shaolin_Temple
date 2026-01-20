import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchAuditLogs = createAsyncThunk(
    'auditLogs/fetchAll',
    async ({ page = 1, limit = 20, action = '', entity = '', userId = '' }, { rejectWithValue }) => {
        try {
            let url = `/audit-logs?page=${page}&limit=${limit}`;
            if (action) url += `&action=${action}`;
            if (entity) url += `&entity=${entity}`;
            if (userId) url += `&userId=${userId}`;

            const response = await apiClient.get(url);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit logs');
        }
    }
);

const initialState = {
    logs: [],
    pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
    },
    loading: false,
    error: null,
};

const auditLogSlice = createSlice({
    name: 'auditLogs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.logs = action.payload.logs;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAuditLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default auditLogSlice.reducer;
