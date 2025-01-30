import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BASE_SPOTIFY_TRACK_URL } from "@/constants/url";
import { trackSchema, type Track } from "@/validations/track";
import { ERRORS } from "@/constants/error";

const useTrack = () => {
  const [error, seError] = useState("");
  const [trackData, setTrackData] = useState<Track | null>(null);

  const fetchTrackData = async () => {
    try {
      const url = new URL(window.location.href);
      const trackId = url.searchParams.get("q");

      if (!trackId) {
        toast.error(ERRORS.NO_TRACK_ID_FOUND);
        seError(ERRORS.NO_TRACK_ID_FOUND);
        return;
      }

      const trackUrl = BASE_SPOTIFY_TRACK_URL + trackId;

      const data = await fetch(
        `/api/lyrics?song_url=${encodeURIComponent(trackUrl)}`
      );

      if (!data.ok) {
        toast.error(ERRORS.FAILED_TO_FETCH_TRACK_DATA);
        seError(ERRORS.FAILED_TO_FETCH_TRACK_DATA);
        return;
      }

      const json = await data.json();

      const track = trackSchema.safeParse({ ...json, url: trackUrl });

      if (!track.success) {
        toast.error(ERRORS.FAILED_TO_PARSE_TRACK_DATA);
        seError(ERRORS.FAILED_TO_PARSE_TRACK_DATA);
        return;
      }

      setTrackData(track.data);
    } catch (error) {
      toast.error(ERRORS.UNKNOWN);
      seError(ERRORS.UNKNOWN);
    }
  };

  useEffect(() => {
    fetchTrackData();
  }, []);

  return {
    data: trackData,
    error,
  };
};

export { useTrack };
