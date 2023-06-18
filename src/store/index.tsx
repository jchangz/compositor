import { configureStore } from "@reduxjs/toolkit";

import clipPathReducer from "./clipPathSlice";

export const store = configureStore({
  reducer: {
    clipPath: clipPathReducer,
  },
});
