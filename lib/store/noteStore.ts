import { NewNote, NoteTag } from "@/types/note";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NoteDraftStore {
  draft: NewNote;
  setDraft: (note: NewNote) => void;
  clearDraft: () => void;
  updateField: (field: keyof NewNote, value: string | NoteTag) => void;
}

const initialDraft: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (note) => set(() => ({ draft: note })),

      clearDraft: () => set(() => ({ draft: initialDraft })),

      updateField: (field, value) =>
        set((state) => ({
          draft: { ...state.draft, [field]: value },
        })),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
