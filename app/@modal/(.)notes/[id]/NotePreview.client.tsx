'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import Loader from '@/components/Loading/Loading';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import css from './NotePreview.module.css';

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <Modal isOpen={true} onClose={handleClose}>
      {isLoading && <Loader />}
      {error || !note ? (
        <ErrorMessage message="Something went wrong." />
      ) : (
        <div className={css.container}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
          </div>
          <div className={css.content}>{note.content}</div>
          <div className={css.date}>{note.createdAt}</div>{' '}
        </div>
      )}
    </Modal>
  );
}
