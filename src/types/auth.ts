import { User as SupabaseUser } from '@supabase/supabase-js'

export interface UserProfile {
  id: string;
  name: string;
  provider: 'google' | 'line' | 'password';
  created_at: string;
}

export interface AuthUser extends SupabaseUser {
  profile?: UserProfile;
}

export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}