import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";

const softwareSlice = createSlice({
  name: "software",
  initialState: {
    loading: false,
    softwares: [],
    error: null,
    message: null,
  },
  reducers: {
    getAllSoftwaresRequest(state) {
      state.softwares = [];
      state.error = null;
      state.loading = true;
    },
    getAllSoftwaresSuccess(state, action) {
      state.softwares = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllSoftwaresFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addNewSoftwareRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewSoftwareSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    addNewSoftwareFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    deleteSoftwareRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteSoftwareSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deleteSoftwareFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    updateSoftwareRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateSoftwareSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    updateSoftwareFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetSoftwareSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const getAllSoftwares = () => async (dispatch) => {
  dispatch(softwareSlice.actions.getAllSoftwaresRequest());
  try {
    const response = await axiosInstance.get('/api/v1/software/getall');
    dispatch(softwareSlice.actions.getAllSoftwaresSuccess(response.data.softwares));
    dispatch(softwareSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Get softwares error:', error);
    dispatch(softwareSlice.actions.getAllSoftwaresFailed(error.response?.data?.message || 'Failed to get softwares'));
  }
};

export const addNewSoftware = (data) => async (dispatch) => {
  dispatch(softwareSlice.actions.addNewSoftwareRequest());
  try {
    const response = await axiosInstance.post('/api/v1/software/add', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    dispatch(softwareSlice.actions.addNewSoftwareSuccess(response.data.message));
    dispatch(softwareSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Add software error:', error);
    dispatch(softwareSlice.actions.addNewSoftwareFailed(error.response?.data?.message || 'Failed to add software'));
  }
};

export const deleteSoftware = (id) => async (dispatch) => {
  dispatch(softwareSlice.actions.deleteSoftwareRequest());
  try {
    const response = await axiosInstance.delete(`/api/v1/software/delete/${id}`);
    dispatch(softwareSlice.actions.deleteSoftwareSuccess(response.data.message));
    dispatch(softwareSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Delete software error:', error);
    dispatch(softwareSlice.actions.deleteSoftwareFailed(error.response?.data?.message || 'Failed to delete software'));
  }
};

export const updateSoftware = (id, newData) => async (dispatch) => {
  dispatch(softwareSlice.actions.updateSoftwareRequest());
  try {
    const response = await axiosInstance.put(`/api/v1/software/update/${id}`, newData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    dispatch(softwareSlice.actions.updateSoftwareSuccess(response.data.message));
    dispatch(softwareSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Update software error:', error);
    dispatch(softwareSlice.actions.updateSoftwareFailed(error.response?.data?.message || 'Failed to update software'));
  }
};

export const resetSoftwareSlice = () => (dispatch) => {
  dispatch(softwareSlice.actions.resetSoftwareSlice());
};

export const clearAllSoftwareErrors = () => (dispatch) => {
  dispatch(softwareSlice.actions.clearAllErrors());
};

export default softwareSlice.reducer; 