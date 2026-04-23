import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface User {
    _id: string | null;
    username: string;
    fullName: string;
    email: string;
    avatar: string;
    phone: string;
    role: string;
}

interface UserState {
    user: User;
    accessToken: string;
    refreshToken: string;
}

const initialState: UserState = {
    user: {
        _id: null,
        username: "",
        fullName: "",
        email: "",
        avatar: "",
        phone: "",
        role: "",
    },
    accessToken: "",
    refreshToken: "",
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
            // Object.assign(state, action.payload);
            if (action.payload.user) {
                state.user = { ...state.user, ...action.payload.user };
            }

            if (action.payload.accessToken) {
                state.accessToken = action.payload.accessToken;
            }

            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken;
            }
        },
    },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;