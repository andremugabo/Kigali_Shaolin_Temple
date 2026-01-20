import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchBlogs = createAsyncThunk(
    'blogs/fetchAll',
    async ({ page = 1, limit = 10, category = '' }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/blogs?page=${page}&limit=${limit}&category=${category}`);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
        }
    }
);

export const createBlog = createAsyncThunk(
    'blogs/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/blogs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
        }
    }
);

export const updateBlog = createAsyncThunk(
    'blogs/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/blogs/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update blog');
        }
    }
);

export const deleteBlog = createAsyncThunk(
    'blogs/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/blogs/${id}`);
            if (response.data.success) {
                return id;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
        }
    }
);

const initialState = {
    blogs: [],
    pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
    },
    loading: false,
    submitting: false,
    error: null,
};

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        clearBlogError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload.blogs;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createBlog.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.submitting = false;
                state.blogs.unshift(action.payload);
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateBlog.pending, (state) => {
                state.submitting = true;
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                state.submitting = false;
                const index = state.blogs.findIndex((b) => b.id === action.payload.id);
                if (index !== -1) {
                    state.blogs[index] = action.payload;
                }
            })
            .addCase(updateBlog.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.filter((b) => b.id !== action.payload);
            });
    },
});

export const { clearBlogError } = blogSlice.actions;
export default blogSlice.reducer;
