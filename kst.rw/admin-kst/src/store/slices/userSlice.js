import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/users?page=${page}&limit=${limit}`);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const createUser = createAsyncThunk(
    'users/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/users/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/users/${id}`);
            if (response.data.success) {
                return id;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

const initialState = {
    users: [],
    pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
    },
    loading: false,
    submitting: false,
    error: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createUser.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.submitting = false;
                state.users.unshift(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateUser.pending, (state) => {
                state.submitting = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.submitting = false;
                const index = state.users.findIndex((u) => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((u) => u.id !== action.payload);
            });
    },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
