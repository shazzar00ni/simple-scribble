import { createClient } from '@supabase/supabase-js';

// Supabase client setup
export const supabaseUrl = 'https://zmxvmdmmdbzpjhtofisj.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpteHZtZG1tZGJ6cGpodG9maXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4Mzk5MDYsImV4cCI6MjA2ODQxNTkwNn0.Rs3Zsei3CgU2gBFgPTk3oOD1-O3DU1VIQZedu4W9bio';

// Database table names
export const TABLES = {
  NOTES: 'app_14c8901445a045689108c48c84fd71fd_notes',
  PROFILES: 'app_14c8901445a045689108c48c84fd71fd_profiles',
  SHARES: 'app_14c8901445a045689108c48c84fd71fd_shares',
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Share {
  id: string;
  note_id: string;
  owner_id: string;
  shared_with_id: string;
  can_edit: boolean;
  created_at: string;
}

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
};

// Get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from(TABLES.PROFILES)
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as Profile;
};