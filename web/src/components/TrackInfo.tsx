import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { BASE_SPOTIFY_TRACK_URL } from "@/constants/url";

interface TrackData {
  url: string;
  track_info: {
    name: string;
    external_url: string;
    preview_url?: string;
    artists: {
      name: string;
      external_url: string;
    }[];
    album: {
      name: string;
      external_url: string;
      image: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  lyrics?: {
    has_lipsync: boolean;
    lines: {
      words: string;
      start_time: number;
      end_time: number;
    }[];
  };
}

const convertMsToSeconds = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);

  const secondsWithLeadingZero = seconds % 60;

  return `${minutes}:${
    secondsWithLeadingZero < 10 ? "0" : ""
  }${secondsWithLeadingZero}`;
};

const TrackDetails = () => {
  const [hasError, setHasError] = useState(false);
  const [trackData, setTrackData] = useState<TrackData | null>(null);

  const fetchTrackData = async () => {
    try {
      const url = new URL(window.location.href);
      const trackId = url.searchParams.get("q");

      if (!trackId) {
        toast.error("No track ID found in URL");
        setHasError(true);
        return;
      }

      const trackUrl = BASE_SPOTIFY_TRACK_URL + trackId;

      const data = await fetch(
        `/api/lyrics?song_url=${encodeURIComponent(trackUrl)}`
      );

      if (!data.ok) {
        setHasError(true);
        toast.error("Failed to fetch track data");
        return;
      }

      const json = await data.json();
      setTrackData({
        ...json,
        url: trackUrl,
      });
    } catch (error) {
      toast.error("Failed to fetch track data");
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchTrackData();
  }, []);

  if (hasError) {
    return <div>Error</div>;
  }

  return (
    <>
      {trackData && (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 md:flex-row">
          <header className="bg-spotify-dark p-6 rounded-xl h-fit relative w-full sm:max-w-56 lg:max-w-96">
            <picture>
              <img
                className="w-full rounded-lg aspect-square bg-cover"
                width={trackData.track_info.album.image.width}
                height={trackData.track_info.album.image.height}
                src={trackData.track_info.album.image.url}
                alt={trackData.track_info.album.name}
                loading="eager"
              />
            </picture>
            <div className="flex gap-2">
              <section className="w-full">
                <div className="mt-6">
                  <h1 className="text-xl font-bold line-clamp-1">
                    {trackData.track_info.name}
                  </h1>
                </div>
                <div className="mt-1">
                  <p className="text-spotify-gray text-sm line-clamp-1">
                    {trackData.track_info.artists.map((artist, index) => (
                      <span key={index}>
                        {index > 0 && ", "}
                        <a
                          href={artist.external_url}
                          className="hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {artist.name}
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
              </section>
              <a
                className="text-sm mt-auto ml-auto duration-200 text-spotify-gray hover:text-white focus-visible:text-white"
                href={trackData.url}
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  aria-hidden="true"
                  data-encore-id="icon"
                  viewBox="0 0 16 16"
                  width={20}
                  height={20}
                  fill="currentColor"
                >
                  <path d="M1 5.75A.75.75 0 0 1 1.75 5H4v1.5H2.5v8h11v-8H12V5h2.25a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75v-9.5z" />
                  <path d="M8 9.576a.75.75 0 0 0 .75-.75V2.903l1.454 1.454a.75.75 0 0 0 1.06-1.06L8 .03 4.735 3.296a.75.75 0 0 0 1.06 1.061L7.25 2.903v5.923c0 .414.336.75.75.75z" />
                </svg>
              </a>
            </div>
          </header>

          <main className="p-6 grow bg-red-950 rounded-xl space-y-2 md:p-10 xl:space-y-4">
            {trackData.lyrics && (
              <>
                {trackData.lyrics.lines.map((line, index) => (
                  <p
                    key={index}
                    className="flex justify-between text-lg items-center text-right gap-6 text-white"
                  >
                    <span className="font-bold text-gray-400">
                      {convertMsToSeconds(line.start_time)}
                    </span>
                    <span className="font-bold xl:text-2xl">{line.words}</span>
                  </p>
                ))}

                <p className="text-sm mt-4 text-right">
                  Lyrics provided by Musixmatch
                </p>
              </>
            )}
          </main>
        </div>
      )}

      <Toaster richColors position="top-right" closeButton />
    </>
  );
};

export { TrackDetails };
