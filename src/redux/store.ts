import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import selectedItemsReducer from './slices/selectedItemsSlice';
import selectedPageReducer from './slices/selectedPageSlice';
import selectedDetailsReducer from './slices/selectedDetailsSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    selectedItems: selectedItemsReducer,
    selectedPage: selectedPageReducer,
    selectedDetails: selectedDetailsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
