'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import type { Note, NoteTag } from '@/types/note';
import { useRouter } from 'next/navigation';
import { useNoteStore, initialDraft } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  initialValues?: NoteFormValues;
}

export default function NoteForm({ initialValues }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [values, setValues] = useState<NoteFormValues>(
    draft || initialValues || initialDraft
  );
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    setValues(draft || initialValues || initialDraft);
  }, [draft, initialValues]);

  const createMutation = useMutation<Note, Error, NoteFormValues>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setDraft({ [name]: value } as Partial<NoteFormValues>);

    if (name === 'title' && value.length >= 3) {
      setTitleError(null);
    }
  };

  const handleTitleBlur = () => {
    if (values.title.length < 3) {
      setTitleError('Title must be at least 3 characters');
    } else {
      setTitleError(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (values.title.length < 3) {
      setTitleError('Title must be at least 3 characters');
      return;
    }
    createMutation.mutate(values);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={values.title}
          onChange={handleChange}
          onBlur={handleTitleBlur}
          required
          minLength={3}
          maxLength={50}
        />
        {titleError && <p className={css.error}>{titleError}</p>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={values.content}
          onChange={handleChange}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={values.tag}
          onChange={handleChange}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
