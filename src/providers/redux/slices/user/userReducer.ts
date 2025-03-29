import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Role } from '@/constants/role';
import type { User } from '@/types/user';

export type UserState = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
};

export const userInitialState: UserState = {
  id: '',
  fullName: '',
  email: '',
  role: Role.GUEST,
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      const { id, fullName, email, role } = action.payload;
      state.id = id;
      state.fullName = fullName;
      state.email = email;
      state.role = role;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
