import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import { fetchServerNotes } from "@/lib/api/serverApi";
import type { NoteTag } from "@/types/note";
import type { NotesHttpResponse } from "@/lib/api/clientApi";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tagFromSlug = slug?.[0] ?? "All";

  const title =
    tagFromSlug === "All"
      ? "NoteHub - All Notes"
      : `NoteHub - Notes tagged "${tagFromSlug}"`;

  const description =
    tagFromSlug === "All"
      ? "Browse all notes in NoteHub."
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
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Preview",
        },
      ],
    },
  };
}

export default async function NotesByCategory({ params }: Props) {
  const { slug } = await params;
  const slugValue: string | undefined = slug?.[0];
  const tag: NoteTag | undefined =
    slugValue === "All" ? undefined : (slugValue as NoteTag);

  const initialData: NotesHttpResponse = await fetchServerNotes("", 1, tag);

  return (
    <main>
      <NotesClient initialData={initialData} tag={tag} />
    </main>
  );
}
