import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function handleShare(title: string, text: string, url: string) {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (err) {
      console.log("Error sharing:", err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.log("Error copying link:", err);
    }
  }
}
