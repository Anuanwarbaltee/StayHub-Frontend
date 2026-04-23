import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlertState {
    type: 'success' | 'error' | 'warning' | 'info' | null;
    message: string | null;
    isVisible: boolean;
}

const initialState: AlertState = {
    type: null,
    message: null,
    isVisible: false,
};

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        showAlert: (state, action: PayloadAction<{ type: AlertState['type']; message: string }>) => {
            state.type = action.payload.type;
            state.message = action.payload.message;
            state.isVisible = true;
        },
        hideAlert: (state) => {
            state.isVisible = false;
        },
    },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;