import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Role } from '@/constants/role';
import type { User } from '@/types/user';

export type UserState = {
  user: User;
};

export const userInitialState: UserState = {
  user: {
    id: '',
    fullName: '',
    email: '',
    role: Role.GUEST,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = userInitialState.user;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
