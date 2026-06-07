import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    uploads: [],
  },
  reducers: {
    addUpload: (state, action) => {
      state.uploads.unshift(action.payload);
    },
    updateUpload: (state, action) => {
      const upload = state.uploads.find((item) => item.id === action.payload.id);
      if (upload) {
        Object.assign(upload, action.payload);
      }
    },
    removeUpload: (state, action) => {
      state.uploads = state.uploads.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addUpload, updateUpload, removeUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
