import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ClipPathPayload {
  id: string;
  clipPath: Array<number>;
}

interface ClipPathData {
  data: {
    [id: string]: Array<number>;
  };
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
  },
});

export const { setClipPath } = clipPathSlice.actions;
export default clipPathSlice.reducer;
