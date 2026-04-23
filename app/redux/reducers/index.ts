import { combineReducers } from '@reduxjs/toolkit';
import filterSlice from './filterSlice';
import userSlice from './userSlice';

const rootReducer = combineReducers({
  bookingFilters: filterSlice,
  user: userSlice,
});

// Extract the RootState type from the rootReducer itself
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;