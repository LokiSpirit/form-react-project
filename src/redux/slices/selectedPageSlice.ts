import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SelectedPageState = {
  page: number;
};

const initialState: SelectedPageState = {
  page: 1,
};

const selectedPageSlice = createSlice({
  name: 'selectedPage',
  initialState,
  reducers: {
    selectPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const { selectPage } = selectedPageSlice.actions;
export default selectedPageSlice.reducer;
