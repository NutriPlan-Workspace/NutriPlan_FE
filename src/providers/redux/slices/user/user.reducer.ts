import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Roles, User } from '@/types/user.types';

export type UserState = {
  id: string;
  fullName: string;
  email: string;
  role: Roles;
};

export const userInitialState: UserState = {
  id: '',
  fullName: '',
  email: '',
  role: Roles.GUEST,
};

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    // TODO: Refine this reducer in Login task
    setUser: (state, action: PayloadAction<User>) => {
      const { id, fullName, email, role } = action.payload;
      state.id = id;
      state.fullName = fullName;
      state.email = email;
      state.role = role as Roles;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
