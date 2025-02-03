import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BASE_SPOTIFY_TRACK_URL } from "@/constants/url";
import { trackSchema, type TrackSchema } from "@/validations/track";
import { ERRORS, type ErrorWithCode } from "@/constants/error";

const {
  FAILED_TO_FETCH_TRACK_DATA,
  FAILED_TO_PARSE_TRACK_DATA,
  NO_TRACK_ID_FOUND,
  UNKNOWN_TRACK_ERROR,
} = ERRORS;

const useTrack = () => {
  const [error, seError] = useState<ErrorWithCode | null>(null);
  const [trackData, setTrackData] = useState<TrackSchema | null>(null);

  const fetchTrackData = async () => {
    try {
      const url = new URL(window.location.href);
      const trackId = url.searchParams.get("q");

      if (!trackId) {
        toast.error(NO_TRACK_ID_FOUND.message);
        seError(NO_TRACK_ID_FOUND);
        return;
      }

      const trackUrl = BASE_SPOTIFY_TRACK_URL + trackId;

      const data = await fetch(
        `/api/lyrics?song_url=${encodeURIComponent(trackUrl)}`
      );

      if (!data.ok) {
        toast.error(FAILED_TO_FETCH_TRACK_DATA.message);
        seError(FAILED_TO_FETCH_TRACK_DATA);
        return;
      }

      const json = await data.json();

      const track = trackSchema.safeParse({ ...json, url: trackUrl });

      if (!track.success) {
        toast.error(FAILED_TO_PARSE_TRACK_DATA.message);
        seError(FAILED_TO_PARSE_TRACK_DATA);
        return;
      }

      setTrackData(track.data);
    } catch (error) {
      toast.error(UNKNOWN_TRACK_ERROR.message);
      seError(UNKNOWN_TRACK_ERROR);
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
