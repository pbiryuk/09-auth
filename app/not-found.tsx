import css from "./Home.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoteHub - Page Not Found",
  description: "The page you are looking for does not exist on NoteHub.",
  openGraph: {
    title: "NoteHub - Page Not Found",
    description: "The page you are looking for does not exist on NoteHub.",
    url: "https://08-zustand-bice-three.vercel.app/not-found",
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

export default function NotFoundPage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}
