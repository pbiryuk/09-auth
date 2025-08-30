import { api } from "./api";
import { User } from "@/types/user";
import { Note, NewNote, NoteTag } from "@/types/note";

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username: string;
}

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

// --- Auth ---
export const register = async (data: SignUpRequest): Promise<User> => {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
};

export const login = async (data: SignInRequest): Promise<User> => {
  const response = await api.post<User>("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (body: UpdateUserRequest): Promise<User> => {
  const response = await api.patch<User>("/users/me", body);
  return response.data;
};

// --- Notes ---
export const fetchNotes = async (
  search: string = "",
  page: number = 1,
  tag?: NoteTag
): Promise<NotesHttpResponse> => {
  try {
    const response = await api.get<NotesHttpResponse>("/notes", {
      params: {
        ...(search && { search }),
        page,
        perPage: 12,
        ...(tag && { tag }),
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch notes.");
  }
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  try {
    const response = await api.post<Note>("/notes", newNote);
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create note.");
  }
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  try {
    const response = await api.delete<Note>(`/notes/${noteId}`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete note.");
  }
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  try {
    const response = await api.get<Note>(`/notes/${noteId}`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch note details.");
  }
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const response = await api.get<{ success: boolean }>("/auth/session");
    return response.data.success;
  } catch (err) {
    console.error("Failed to check session:", err);
    return false;
  }
};
