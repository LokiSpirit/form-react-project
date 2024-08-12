import { configureStore } from '@reduxjs/toolkit';
import selectedFormDataReducer from './slices/selectedFormDataSlice';
import selectedCountryReducer from './slices/selectedCountrySlice';


export const store = configureStore({
  reducer: {
    selectedFormData: selectedFormDataReducer,
    selectedCountry: selectedCountryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
