import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';

interface NotesPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const tagFromSlug = resolvedParams.slug?.[0] ?? 'All';

  const title =
    tagFromSlug === 'All'
      ? 'NoteHub - All Notes'
      : `NoteHub - Notes tagged "${tagFromSlug}"`;

  const description =
    tagFromSlug === 'All'
      ? 'Browse all notes in NoteHub.'
      : `Browse notes tagged "${tagFromSlug}" in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-bice-three.vercel.app/notes/filter/${tagFromSlug}`,
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
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tagFromSlug = slug?.[0] ?? 'All';
  const category = tagFromSlug === 'All' ? undefined : tagFromSlug;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tagFromSlug, '', 1],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        tag: category,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tagFromSlug} />
    </HydrationBoundary>
  );
}
