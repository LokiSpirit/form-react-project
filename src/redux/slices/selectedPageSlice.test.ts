import { configureStore } from '@reduxjs/toolkit';
import selectedPageReducer, { selectPage, SelectedPageState } from './selectedPageSlice';

describe('selectedPageSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        selectedPage: selectedPageReducer,
      },
    });
  });

  it('should handle initial state', () => {
    const initialState: SelectedPageState = {
      page: 1,
    };
    const state = store.getState().selectedPage;
    expect(state).toEqual(initialState);
  });

  it('should handle selectPage', () => {
    const newPage = 3;
    store.dispatch(selectPage(newPage));
    const state = store.getState().selectedPage;
    expect(state.page).toEqual(newPage);
  });
});
