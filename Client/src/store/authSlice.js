import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from "../api/axiosInstance";
 
const storedToken = localStorage.getItem("token") || null;
const storedUser = JSON.parse(localStorage.getItem("user")) || null;
 
// 1. Login original (sin cambios)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return {
        token: response.data.token,
        email: response.data.email,
        user: response.data.user
      };
    } catch (error) {
      let errorMessage = "Error de conexión";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Credenciales incorrectas. Verifica tus datos.";
        } else {
          errorMessage = error.response.data?.message || `Error ${error.response.status}`;
        }
      }
      return rejectWithValue(errorMessage);
    }
  }
);
 
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken,
    email: storedUser?.email || null,
    user: storedUser || { name: null, role: null, avatar: null },
    loading: false,
    error: null,
    isAuthenticated: !!storedToken
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.user = { name: null, role: null, avatar: null };
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.email = action.payload.email;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});
 
export const { logout } = authSlice.actions;
export default authSlice.reducer;