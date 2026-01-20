import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchMessages = createAsyncThunk(
    'messages/fetchAll',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/contact-messages?page=${page}&limit=${limit}`);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
        }
    }
);

export const markMessageAsRead = createAsyncThunk(
    'messages/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(`/contact-messages/${id}/read`);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark message as read');
        }
    }
);

export const deleteMessage = createAsyncThunk(
    'messages/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/contact-messages/${id}`);
            if (response.data.success) {
                return id;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
        }
    }
);

const initialState = {
    messages: [],
    pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
    },
    loading: false,
    error: null,
};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload.messages;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markMessageAsRead.fulfilled, (state, action) => {
                const index = state.messages.findIndex((m) => m.id === action.payload.id);
                if (index !== -1) {
                    state.messages[index].is_read = true;
                }
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter((m) => m.id !== action.payload);
            });
    },
});

export default messageSlice.reducer;
