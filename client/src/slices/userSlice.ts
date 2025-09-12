import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

export interface UserState {
  currentUser: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const persisted = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

const initialState: UserState = {
  currentUser: persisted ? (JSON.parse(persisted) as User) : null,
  status: 'idle',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
      try {
        if (action.payload) localStorage.setItem('user', JSON.stringify(action.payload));
        else localStorage.removeItem('user');
      } catch {}
    },
    setStatus(state, action: PayloadAction<UserState['status']>) {
      state.status = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (!state.currentUser) return;
      state.currentUser = { ...state.currentUser, ...action.payload } as User;
      try { localStorage.setItem('user', JSON.stringify(state.currentUser)); } catch {}
    }
  }
});

export const { setUser, setStatus, updateUser } = userSlice.actions;
export default userSlice.reducer;


