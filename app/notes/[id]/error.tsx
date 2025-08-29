'use client';

interface NoteErrorProps {
  error: Error;
}

export default function NoteError({ error }: NoteErrorProps) {
  return (
    <div style={{ color: '#b00020', textAlign: 'center', marginTop: '50px' }}>
      <p>Could not fetch note details. {error.message}</p>
    </div>
  );
}
