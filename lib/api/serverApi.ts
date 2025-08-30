import { api } from "./api";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { NotesHttpResponse } from "./clientApi";
import { Note, NoteTag } from "@/types/note";

// --- User / Auth ---
export const getServerMe = async (): Promise<User> => {
  const cookieStore = cookies();
  const response = await api.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
};

export const checkServerSession = async (): Promise<boolean> => {
  const cookieStore = cookies();
  const response = await api.get<{ success: boolean }>("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data.success;
};

// --- Notes ---
export const fetchServerNotes = async (
  search: string = "",
  page: number = 1,
  tag?: NoteTag
): Promise<NotesHttpResponse> => {
  const cookieStore = cookies();
  const params = {
    ...(search && { search }),
    page,
    perPage: 12,
    ...(tag && { tag }),
  };

  const response = await api.get<NotesHttpResponse>("/notes", {
    params,
    headers: { Cookie: cookieStore.toString() },
  });

  return response.data;
};

export const fetchServerNoteById = async (noteId: string): Promise<Note> => {
  const cookieStore = cookies();
  const response = await api.get<Note>(`/notes/${noteId}`, {
    headers: { Cookie: cookieStore.toString() },
  });

  return response.data;
};
