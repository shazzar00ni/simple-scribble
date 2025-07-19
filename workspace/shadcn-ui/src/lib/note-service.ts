import { supabase, TABLES, Note, Share } from "@/lib/supabase";

// Get all notes for the current user
export const getUserNotes = async () => {
  const { data: notes, error } = await supabase
    .from(TABLES.NOTES)
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return notes as Note[];
};

// Get a single note by ID
export const getNoteById = async (noteId: string) => {
  const { data, error } = await supabase
    .from(TABLES.NOTES)
    .select('*')
    .eq('id', noteId)
    .single();
  
  if (error) throw error;
  return data as Note;
};

// Create a new note
export const createNote = async (title: string, content: string = '') => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from(TABLES.NOTES)
    .insert([
      {
        title,
        content,
        user_id: userData.user.id,
        is_public: false,
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data as Note;
};

// Update an existing note
export const updateNote = async (noteId: string, updates: Partial<Note>) => {
  const { data, error } = await supabase
    .from(TABLES.NOTES)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', noteId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Note;
};

// Delete a note
export const deleteNote = async (noteId: string) => {
  const { error } = await supabase
    .from(TABLES.NOTES)
    .delete()
    .eq('id', noteId);
  
  if (error) throw error;
  return true;
};

// Toggle a note's public status
export const toggleNotePublic = async (noteId: string, isPublic: boolean) => {
  return await updateNote(noteId, { is_public: isPublic });
};

// Share note with another user
export const shareNoteWithUser = async (noteId: string, email: string, canEdit: boolean = false) => {
  // First, find the user by email
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .limit(1);
  
  if (userError) throw userError;
  if (!users || users.length === 0) throw new Error('User not found');
  
  const sharedWithId = users[0].id;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');
  
  // Create share record
  const { data, error } = await supabase
    .from(TABLES.SHARES)
    .insert([
      {
        note_id: noteId,
        owner_id: userData.user.id,
        shared_with_id: sharedWithId,
        can_edit: canEdit,
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data as Share;
};

// Get all notes shared with the current user
export const getSharedWithMeNotes = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');
  
  // Get the notes that are shared with the current user
  const { data, error } = await supabase
    .from(TABLES.NOTES)
    .select(`
      *,
      ${TABLES.SHARES}!inner(*)
    `)
    .eq(`${TABLES.SHARES}.shared_with_id`, userData.user.id)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data as Note[];
};

// Get all shares for a specific note
export const getNoteShares = async (noteId: string) => {
  const { data, error } = await supabase
    .from(TABLES.SHARES)
    .select(`
      *,
      shared_with:shared_with_id(id, email, display_name)
    `)
    .eq('note_id', noteId);
  
  if (error) throw error;
  return data;
};

// Remove a share
export const removeShare = async (shareId: string) => {
  const { error } = await supabase
    .from(TABLES.SHARES)
    .delete()
    .eq('id', shareId);
  
  if (error) throw error;
  return true;
};