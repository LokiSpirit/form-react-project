import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ActionDetails = {
  id: string;
  url: string;
};
interface SelectedDetailsState {
  selectedId: string | null;
  selectedUrl: string | null;
}

const initialState: SelectedDetailsState = {
  selectedId: null,
  selectedUrl: null,
};

const selectedDetailsSlice = createSlice({
  name: 'selectedDetails',
  initialState,
  reducers: {
    selectDetails: (state, action: PayloadAction<ActionDetails>) => {
      state.selectedId = action.payload.id;
      state.selectedUrl = action.payload.url;
    },
    unselectDetails: (state) => {
      state.selectedUrl = null;
      state.selectedId = null;
    },
  },
});

export const { selectDetails, unselectDetails } = selectedDetailsSlice.actions;
export default selectedDetailsSlice.reducer;
