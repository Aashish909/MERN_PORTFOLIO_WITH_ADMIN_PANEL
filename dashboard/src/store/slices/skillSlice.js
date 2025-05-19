import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";

const skillSlice = createSlice({
  name: "skill",
  initialState: {
    loading: false,
    skills: [],
    error: null,
    message: null,
  },
  reducers: {
    getAllSkillsRequest(state) {
      state.skills = [];
      state.error = null;
      state.loading = true;
    },
    getAllSkillsSuccess(state, action) {
      state.skills = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllSkillsFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addNewSkillRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewSkillSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    addNewSkillFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    deleteSkillRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteSkillSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deleteSkillFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    updateSkillRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateSkillSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    updateSkillFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetSkillSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const getAllSkills = () => async (dispatch) => {
  dispatch(skillSlice.actions.getAllSkillsRequest());
  try {
    const response = await axiosInstance.get('/api/v1/skill/getall');
    dispatch(skillSlice.actions.getAllSkillsSuccess(response.data.skills));
    dispatch(skillSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Get skills error:', error);
    dispatch(skillSlice.actions.getAllSkillsFailed(error.response?.data?.message || 'Failed to get skills'));
  }
};

export const addNewSkill = (data) => async (dispatch) => {
  dispatch(skillSlice.actions.addNewSkillRequest());
  try {
    const response = await axiosInstance.post('/api/v1/skill/add', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    dispatch(skillSlice.actions.addNewSkillSuccess(response.data.message));
    dispatch(skillSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Add skill error:', error);
    dispatch(skillSlice.actions.addNewSkillFailed(error.response?.data?.message || 'Failed to add skill'));
  }
};

export const deleteSkill = (id) => async (dispatch) => {
  dispatch(skillSlice.actions.deleteSkillRequest());
  try {
    const response = await axiosInstance.delete(`/api/v1/skill/delete/${id}`);
    dispatch(skillSlice.actions.deleteSkillSuccess(response.data.message));
    dispatch(skillSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Delete skill error:', error);
    dispatch(skillSlice.actions.deleteSkillFailed(error.response?.data?.message || 'Failed to delete skill'));
  }
};

export const updateSkill = (id, newData) => async (dispatch) => {
  dispatch(skillSlice.actions.updateSkillRequest());
  try {
    const response = await axiosInstance.put(`/api/v1/skill/update/${id}`, newData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    dispatch(skillSlice.actions.updateSkillSuccess(response.data.message));
    dispatch(skillSlice.actions.clearAllErrors());
  } catch (error) {
    console.error('Update skill error:', error);
    dispatch(skillSlice.actions.updateSkillFailed(error.response?.data?.message || 'Failed to update skill'));
  }
};

export const resetSkillSlice = () => (dispatch) => {
  dispatch(skillSlice.actions.resetSkillSlice());
};

export const clearAllSkillErrors = () => (dispatch) => {
  dispatch(skillSlice.actions.clearAllErrors());
};

export default skillSlice.reducer;
