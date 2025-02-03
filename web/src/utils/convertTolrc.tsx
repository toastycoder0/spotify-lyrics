import type { TrackInfoSchema, TrackLyricsSchema } from "@/validations/track";
import { convertMsToSeconds } from "@/utils/convertMsToSeconds";

export const convertToLrc = (
  lyrics: TrackLyricsSchema,
  trackInfo: TrackInfoSchema
) => {
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

  const astristsNames = trackInfo.artists.map((artist) => artist.name);
  a.download = `${trackInfo.name} - ${astristsNames.join(", ")}.lrc`;
  a.click();
};
