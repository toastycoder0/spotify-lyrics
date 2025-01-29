import { useState, useEffect } from "react";
import { toast } from "sonner";
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
          <div>
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
            <div className="mt-8 flex gap-4 items-center">
              <a
                href="/"
                className="size-14 bg-spotify-pure-green flex rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={28}
                  height={28}
                  fill="none"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="m-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m17 17 4 4M3 11a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z"
                  />
                </svg>
              </a>
              <button className="bg-white h-14 text-black py-2 px-4 grow rounded-full">
                Download .lcr file
              </button>
            </div>
          </div>

          <main className="p-6 grow min-h-72 flex flex-col bg-[#333] text-white text-xl rounded-xl gap-2 md:p-10 xl:gap-4">
            {trackData.lyrics ? (
              <>
                {trackData.lyrics.lines.map((line, index) => (
                  <p
                    key={index}
                    className="flex justify-between items-center text-right gap-6"
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
            ) : (
              <p className="xl:text-2xl text-center max-w-96 m-auto">
                Sorry we couldn't find any lyrics for this track. Please try
                another one.
              </p>
            )}
          </main>
        </div>
      )}
    </>
  );
};

export { TrackDetails };
