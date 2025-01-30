import type { FC } from "react";
import type { TrackInfoSchema } from "@/validations/track";
import { ShareIcon } from "@/components/ShareIcon";
import { SearchIcon } from "@/components/SearchIcon";

interface TrackDetailsProps {
  info: TrackInfoSchema;
  isDisabled?: boolean;
  trackUrl: string;
}

const TrackInfo: FC<TrackDetailsProps> = ({ info, isDisabled, trackUrl }) => {
  return (
    <div>
      <header className="bg-spotify-dark p-6 rounded-xl h-fit relative w-full sm:max-w-56 lg:max-w-96">
        <picture>
          <img
            className="w-full rounded-lg aspect-square bg-cover"
            width={info.album.image.width}
            height={info.album.image.height}
            src={info.album.image.url}
            alt={info.album.name}
            loading="eager"
          />
        </picture>
        <div className="flex gap-2">
          <section className="w-full">
            <div className="mt-6">
              <h1 className="text-xl font-bold line-clamp-1">{info.name}</h1>
            </div>
            <div className="mt-1">
              <p className="text-spotify-gray text-sm line-clamp-1">
                {info.artists.map((artist, index) => (
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
            href={trackUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ShareIcon />
          </a>
        </div>
      </header>
      <div className="mt-8 flex gap-4 items-center">
        <a href="/" className="size-14 bg-spotify-pure-green flex rounded-full">
          <SearchIcon />
        </a>
        <button
          disabled={isDisabled}
          className="bg-white h-14 text-black py-2 px-4 grow rounded-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Download .lcr file
        </button>
      </div>
    </div>
  );
};

export { TrackInfo };
