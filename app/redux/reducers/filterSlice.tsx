import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Define a type for the slice state
interface FilterState {
  startDate: string;
  endDate: string;
  capacity: number;
  location: string;
}

// 2. Define the initial state using that type
const initialState: FilterState = {
  startDate: '',
  endDate: '',
  capacity: 1,
  location: '',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // 3. Use PayloadAction to type the incoming changes
    // Partial<FilterState> allows passing only the fields you want to update
    // filterSlice.ts
    updateFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      // Immer handles the immutability for you!
      Object.assign(state, action.payload);
    },
  },
});

export const { updateFilters } = filterSlice.actions;
export default filterSlice.reducer;