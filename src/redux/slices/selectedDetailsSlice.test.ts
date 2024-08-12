import { configureStore } from '@reduxjs/toolkit';
import selectedDetailsReducer, { selectDetails, unselectDetails, SelectedDetailsState } from './selectedDetailsSlice';

describe('selectedDetailsSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        selectedDetails: selectedDetailsReducer,
      },
    });
  });

  it('should handle initial state', () => {
    const initialState: SelectedDetailsState = {
      selectedId: null,
      selectedUrl: null,
    };
    const state = store.getState().selectedDetails;
    expect(state).toEqual(initialState);
  });

  it('should handle selectDetails', () => {
    const actionDetails = {
      id: '123',
      url: 'http://example.com',
    };
    store.dispatch(selectDetails(actionDetails));
    const state = store.getState().selectedDetails;
    expect(state.selectedId).toEqual(actionDetails.id);
    expect(state.selectedUrl).toEqual(actionDetails.url);
  });

  it('should handle unselectDetails', () => {
    const actionDetails = {
      id: '123',
      url: 'http://example.com',
    };
    store.dispatch(selectDetails(actionDetails));
    store.dispatch(unselectDetails());
    const state = store.getState().selectedDetails;
    expect(state.selectedId).toBeNull();
    expect(state.selectedUrl).toBeNull();
  });
});
