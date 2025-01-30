import type { FC } from "react";
import type { TrackLyricsSchema } from "@/validations/track";
import { convertMsToSeconds } from "@/utils/convertMsToSeconds";

interface TrackLyricsProps {
  lyrics: TrackLyricsSchema;
}

const TrackLyrics: FC<TrackLyricsProps> = ({ lyrics }) => {
  return (
    <main className="p-6 grow min-h-72 flex flex-col bg-[#333] text-white text-xl rounded-xl gap-2 md:p-10 xl:gap-4">
      {lyrics ? (
        <>
          {lyrics.lines.map((line, index) => (
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
          Sorry we couldn't find any lyrics for this track. Please try another
          one.
        </p>
      )}
    </main>
  );
};

export { TrackLyrics };
