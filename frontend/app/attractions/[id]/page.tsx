"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LikeButton from "@/app/components/LikeButton";
import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";

interface Item {
  id: number;
  name: string;
  detail: string;
  coverimage: string;
  latitude: number;
  longitude: number;
  likes: number;
  createdAt: string;
}

export default function AttractionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [attraction, setRows] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getAttractions() {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        const res = await fetch(`${apiHost}/attractions/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (data.ok === false) {
          setRows(null);
        }
        else {
          setRows(data);
        }
      } catch (err: any) {
        setError(err.message);

      } finally {
        setLoading(false);
      }
    }

    getAttractions();
  }, []);


  // const attraction = await prisma.attraction.findUnique({
  //   where: { id: Number(id) },
  //   include: { _count: { select: { likes: true } } },
  // });

  // if (!attraction) {
  //   notFound();
  // }

  if (loading) {
    return (
      <main className="container">
        <div className="empty">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <div className="empty">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="container">
      {!attraction ? (
        <div className="empty">No attractions found.</div>
      ) : (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="mb-6 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Attractions
            </Link>

            <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-zinc-900">
              <div className="relative h-64 w-full sm:h-96">
                <Image
                  src={attraction.coverimage}
                  alt={attraction.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-6 sm:p-8">
                <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {attraction.name}
                </h1>

                <p className="mb-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {attraction.detail}
                </p>

                <div className="flex flex-wrap gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      {attraction.latitude.toFixed(6)}, {attraction.longitude.toFixed(6)}
                    </span>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    View on Google Maps
                  </a>

                  <LikeButton
                    attractionId={attraction.id}
                    initialLikes={attraction.likes}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}