import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FormData = {
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  picture: string;
  country: string;
}

interface FormState {
  formData: FormData[];
}

const initialState: FormState = {
  formData: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData(state, action: PayloadAction<FormData>) {
      state.formData.unshift(action.payload);
    },
  },
});

export const { setFormData } = formSlice.actions;

export default formSlice.reducer;
