"use client";

import { useState } from "react";

interface LikeButtonProps {
  attractionId: number;
  initialLikes: number;
}

export default function LikeButton({
  attractionId,
  initialLikes,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const apiHost = process.env.NEXT_PUBLIC_API_HOST;
      const res = await fetch(`${apiHost}/attractions/${attractionId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
      }
    } catch (error) {
      console.error("Failed to like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
    >
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span>{likes}</span>
    </button>
  );
}