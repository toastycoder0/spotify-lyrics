import type { TrackLyricsSchema } from "@/validations/track";
import { TrackInfo } from "@/components/TrackInfo";
import { TrackLyrics } from "@/components/TrackLyrics";
import { Loading } from "@/sections/Loading";
import { Error } from "@/sections/Error";
import { useTrack } from "@/hooks/useTrack";
import { convertMsToSeconds } from "@/utils/convertMsToSeconds";

const TrackDetails = () => {
  const { data, error } = useTrack();

  const convertToLrc = (lyrics: TrackLyricsSchema, name: string) => {
    if (!lyrics) {
      return;
    }

    const lines = lyrics.lines.map(
      (line) => `[00:${convertMsToSeconds(line.start_time)}]${line.words}`
    );

    const lrcLines = lines.join("\n");

    const blob = new Blob([lrcLines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.lrc`;
    a.click();
  };

  if (error) {
    return <Error error={error} />;
  }

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 md:flex-row">
      <TrackInfo
        onDonwload={() =>
          convertToLrc(
            data.lyrics,
            `${data.track_info.name} - ${data.track_info.artists
              .map((artist) => artist.name)
              .join(", ")}`
          )
        }
        info={data.track_info}
        trackUrl={data.url}
        isDisabled={!data.lyrics}
      />
      <TrackLyrics lyrics={data.lyrics} />
    </div>
  );
};

export { TrackDetails };
