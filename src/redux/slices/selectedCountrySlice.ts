import { createSlice } from '@reduxjs/toolkit';

type CountryState= {
  countries: string[];
}

const initialState: CountryState = {
  countries: ['United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'India', 'China'],
};

const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {},
});

export default countrySlice.reducer;
