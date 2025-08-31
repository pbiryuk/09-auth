import { api } from "./api";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { NotesHttpResponse } from "./clientApi";
import { Note, NoteTag } from "@/types/note";

export const getServerMe = async (): Promise<User> => {
  const cookieStore = cookies();
  const response = await api.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
};

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

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
