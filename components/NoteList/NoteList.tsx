'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';
import type { Note } from '@/types/note';
import Link from 'next/link';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onNoteClick?: (id: string) => void;
}

export default function NoteList({ notes, onNoteClick }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<Note, Error, string>({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title} onClick={() => onNoteClick?.(id)}>
            {title}
          </h2>
          <p className={css.content} onClick={() => onNoteClick?.(id)}>
            {content}
          </p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href={`/notes/${id}`} className={css.link}>
                View details
              </Link>
              <button
                className={css.button}
                onClick={() => deleteMutation.mutate(id.toString())}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
