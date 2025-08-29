'use client';

interface NotesErrorProps {
  error: Error;
}

export default function NotesError({ error }: NotesErrorProps) {
  return (
    <div style={{ color: '#b00020', textAlign: 'center', marginTop: '50px' }}>
      <h1>Something went wrong 😕</h1>
      <p>{error.message || 'Unable to load notes.'}</p>
    </div>
  );
}
