import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';
import { useNoteStore, initialDraft } from '@/lib/store/noteStore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NoteHub - Create Note',
  description: 'Create a new note in NoteHub.',
  openGraph: {
    title: 'NoteHub - Create Note',
    description: 'Create a new note in NoteHub.',
    url: 'https://08-zustand-bice-three.vercel.app/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Preview',
      },
    ],
  },
};

export default function CreateNotePage() {
  const draft = useNoteStore.getState().draft || initialDraft;

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm initialValues={draft} />
      </div>
    </main>
  );
}
