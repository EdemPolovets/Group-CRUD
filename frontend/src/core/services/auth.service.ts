import { api } from '../api/client';
 
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}
 
export interface AuthCredentials {
  email: string;
  password: string;
  username?: string;
}
 
export class AuthService {
  static async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    this.setToken(response.data.token);
    this.setUsername(response.data.user.username);
    this.setUserId(response.data.user.id);
    return response.data;
  }
 
  static async register(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    this.setToken(response.data.token);
    this.setUsername(response.data.user.username);
    this.setUserId(response.data.user.id);
    return response.data;
  }
 
  static setToken(token: string): void {
    localStorage.setItem('token', token);
  }
 
  static getToken(): string | null {
    return localStorage.getItem('token');
  }
 
  static setUsername(username: string): void {
    localStorage.setItem('username', username);
  }
 
  static getUsername(): string | null {
    return localStorage.getItem('username');
  }
 
  static setUserId(userId: string): void {
    localStorage.setItem('userId', userId);
  }
 
  static getUserId(): string | null {
    return localStorage.getItem('userId');
  }
 
  static removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  }
}
 
export const handleAuth = async (
  email: string,
  password: string,
  isSignUp: boolean,
  username?: string
) => {
  if (isSignUp && !username) {
    throw new Error('Username is required for registration');
  }
 
  if (isSignUp) {
    await AuthService.register({ email, password, username: username! });
  } else {
    await AuthService.login({ email, password });
  }
};