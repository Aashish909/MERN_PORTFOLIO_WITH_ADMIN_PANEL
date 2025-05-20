import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: {},
    isAuthenticated: false,
    error: null,
    message: null,
    isUpdated: false,
  },
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = action.payload;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    loadUserRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loadUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loadUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.isUpdated = false;
      state.message = null;
      state.error = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload;
      state.error = null;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.message = null;
      state.error = action.payload;
    },
    updateProfileRequest(state) {
      state.loading = true;
      state.isUpdated = false;
      state.message = null;
      state.error = null;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload;
      state.error = null;
    },
    updateProfileFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.message = null;
      state.error = action.payload;
    },
    updateProfileResetAfterUpdate(state) {
      state.error = null;
      state.isUpdated = false;
      state.message = null;
    },
    clearAllErrors(state) {
      state.error = null;
    }
  },
});

export const login = (email, password) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    // First, attempt to login
    const loginResponse = await axiosInstance.post('/api/v1/user/login', { email, password });
    
    if (loginResponse.data.success) {
      // If login is successful, get user data
      const userResponse = await axiosInstance.get('/api/v1/user/me');
      
      if (userResponse.data.success) {
        dispatch(userSlice.actions.loginSuccess(userResponse.data.user));
        dispatch(userSlice.actions.clearAllErrors());
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        throw new Error('Failed to get user data after login');
      }
    } else {
      throw new Error(loginResponse.data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    dispatch(userSlice.actions.loginFailed(errorMessage));
    localStorage.removeItem('isAuthenticated');
    
    // If the error is due to invalid credentials, we can be more specific
    if (error.response?.status === 401) {
      dispatch(userSlice.actions.loginFailed('Invalid email or password'));
    }
  }
};

export const getUser = () => async (dispatch) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (!isAuthenticated) {
    dispatch(userSlice.actions.loadUserFailed('Not authenticated'));
    return;
  }

  dispatch(userSlice.actions.loadUserRequest());
  try {
    const { data } = await axiosInstance.get('/api/v1/user/me');
    
    if (data.success) {
      dispatch(userSlice.actions.loadUserSuccess(data.user));
      dispatch(userSlice.actions.clearAllErrors());
    } else {
      throw new Error(data.message || 'Failed to get user data');
    }
  } catch (error) {
    console.error('Get user error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to get user';
    dispatch(userSlice.actions.loadUserFailed(errorMessage));
    
    // If we get a 401, clear the authentication state
    if (error.response?.status === 401) {
      localStorage.removeItem('isAuthenticated');
    }
  }
};

export const logout = () => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get('/api/v1/user/logout');
    
    if (data.success) {
      dispatch(userSlice.actions.logoutSuccess(data.message));
      dispatch(userSlice.actions.clearAllErrors());
      localStorage.removeItem('isAuthenticated');
    } else {
      throw new Error(data.message || 'Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Logout failed';
    dispatch(userSlice.actions.logoutFailed(errorMessage));
    
    // Even if the server request fails, we should still clear local auth state
    localStorage.removeItem('isAuthenticated');
  }
};

export const updatePassword =
  (currentPassword, newPassword, confirmNewPassword) => async (dispatch) => {
    dispatch(userSlice.actions.updatePasswordRequest());
    try {
      const { data } = await axiosInstance.put('/api/v1/user/password/update', { currentPassword, newPassword, confirmNewPassword });
      dispatch(userSlice.actions.updatePasswordSuccess(data.message));
      dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(
        userSlice.actions.updatePasswordFailed(error.response.data.message)
      );
    }
  };

export const updateProfile = (data) => async (dispatch) => {
  dispatch(userSlice.actions.updateProfileRequest());
  try {
    const response = await axiosInstance.put('/api/v1/user/me/profile/update', data);
    dispatch(userSlice.actions.updateProfileSuccess(response.data.message));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      userSlice.actions.updateProfileFailed(error.response.data.message)
    );
  }
};

export const resetProfile = () => (dispatch) => {
  dispatch(userSlice.actions.updateProfileResetAfterUpdate());
};
export const clearAllUserErrors = () => (dispatch) => {
  dispatch(userSlice.actions.clearAllErrors());
};

export default userSlice.reducer;
