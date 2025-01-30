import { TrackInfo } from "@/components/TrackInfo";
import { convertMsToSeconds } from "@/utils/convertMsToSeconds";
import { useTrack } from "@/hooks/useTrack";

const TrackDetails = () => {
  const { data, error } = useTrack();

  if (error) {
    return <div>Error</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 md:flex-row">
      <TrackInfo
        info={data.track_info}
        trackUrl={data.url}
        isDisabled={!data.lyrics}
      />

      <main className="p-6 grow min-h-72 flex flex-col bg-[#333] text-white text-xl rounded-xl gap-2 md:p-10 xl:gap-4">
        {data.lyrics ? (
          <>
            {data.lyrics.lines.map((line, index) => (
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
    </div>
  );
};

export { TrackDetails };
