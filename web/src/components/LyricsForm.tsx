import type { FormEvent } from "react";
import { toast } from "sonner";
import { BASE_SPOTIFY_TRACK_URL } from "@/constants/url";

const LyricsForm = () => {
  const onSubmitTrackURL = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const url = formData.get("url")?.toString().trim();

    if (!url) {
      return toast.error("The URL cannot be empty");
    }

    const urlWithoutParams = url.split("?")[0];

    const isValidUrl = urlWithoutParams.startsWith(BASE_SPOTIFY_TRACK_URL);

    if (!isValidUrl) {
      return toast.error("Please enter a valid Spotify URL");
    }

    const trackId = urlWithoutParams.split("/").pop();

    if (!trackId) {
      return toast.error("Failed to extract track ID from URL");
    }

    window.location.href = `/track?q=${trackId}`;
  };

  return (
    <form
      onSubmit={onSubmitTrackURL}
      className="flex flex-col items-center gap-6 w-full"
    >
      <input
        name="url"
        type="text"
        placeholder="Enter a valid Spotify URL"
        className="py-3 px-4 rounded-full w-full max-w-xs text-black duration-200 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify-pure-green"
      />

      <button
        type="submit"
        className="uppercase duration-200 font-sans font-black text-spotify-purple bg-spotify-green py-4 px-8 rounded-full hover:bg-spotify-black hover:text-spotify-green focus-visible:bg-spotify-black focus-visible:text-spotify-green"
      >
        Get Lyrics
      </button>
    </form>
  );
};

export { LyricsForm };
