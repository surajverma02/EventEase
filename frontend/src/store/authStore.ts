import { create } from 'zustand';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'ORGANIZER' | 'USER';
  phone?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Initialize state from localStorage
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      return {
        user: JSON.parse(userData),
        token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to parse stored auth data');
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));
