import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    loading: false,
    projects: [],
    error: null,
    message: null,
    singleProject: {},
  },
  reducers: {
    getAllProjectsRequest(state) {
      state.projects = [];
      state.error = null;
      state.loading = true;
    },
    getAllProjectsSuccess(state, action) {
      state.projects = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllProjectsFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addNewProjectRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewProjectSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    addNewProjectFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    deleteProjectRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteProjectSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deleteProjectFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    updateProjectRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateProjectSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    updateProjectFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetProjectSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const getAllProjects = () => async (dispatch) => {
  dispatch(projectSlice.actions.getAllProjectsRequest());
  try {
    const response = await axiosInstance.get('/api/v1/project/getall');
    dispatch(projectSlice.actions.getAllProjectsSuccess(response.data.projects));
    dispatch(projectSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Get projects error:', error);
    dispatch(projectSlice.actions.getAllProjectsFailed(error.response?.data?.message || 'Failed to get projects'));
  }
};

export const addNewProject = (data) => async (dispatch) => {
  dispatch(projectSlice.actions.addNewProjectRequest());
  try {
    const response = await axiosInstance.post('/api/v1/project/add', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    dispatch(projectSlice.actions.addNewProjectSuccess(response.data.message));
    dispatch(projectSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Add project error:', error);
    dispatch(projectSlice.actions.addNewProjectFailed(error.response?.data?.message || 'Failed to add project'));
  }
};

export const deleteProject = (id) => async (dispatch) => {
  dispatch(projectSlice.actions.deleteProjectRequest());
  try {
    const response = await axiosInstance.delete(`/api/v1/project/delete/${id}`);
    dispatch(projectSlice.actions.deleteProjectSuccess(response.data.message));
    dispatch(projectSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Delete project error:', error);
    dispatch(projectSlice.actions.deleteProjectFailed(error.response?.data?.message || 'Failed to delete project'));
  }
};

export const updateProject = (id, newData) => async (dispatch) => {
  dispatch(projectSlice.actions.updateProjectRequest());
  try {
    const response = await axiosInstance.put(`/api/v1/project/update/${id}`, newData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    dispatch(projectSlice.actions.updateProjectSuccess(response.data.message));
    dispatch(projectSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Update project error:', error);
    dispatch(projectSlice.actions.updateProjectFailed(error.response?.data?.message || 'Failed to update project'));
  }
};

export const resetProjectSlice = () => (dispatch) => {
  dispatch(projectSlice.actions.resetProjectSlice());
};

export const clearAllProjectErrors = () => (dispatch) => {
  dispatch(projectSlice.actions.clearAllErrors());
};

export default projectSlice.reducer;
