import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ClipPathPayload {
  id: string;
  clipPath: Array<number>;
}

export interface ClipPathBatchPayload {
  [id: string]: Array<number>;
}

interface ClipPathData {
  data: ClipPathBatchPayload;
}

const initialState: ClipPathData = { data: {} };

const clipPathSlice = createSlice({
  name: "clipPath",
  initialState,
  reducers: {
    setClipPath(state, action: PayloadAction<ClipPathPayload>) {
      state.data = {
        ...state.data,
        [action.payload.id]: action.payload.clipPath,
      };
    },
    setClipPathBatch(state, action: PayloadAction<ClipPathBatchPayload>) {
      state.data = { ...state.data, ...action.payload };
    },
  },
});

export const { setClipPath, setClipPathBatch } = clipPathSlice.actions;
export default clipPathSlice.reducer;
