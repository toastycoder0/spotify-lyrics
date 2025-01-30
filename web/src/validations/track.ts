import { z } from "zod";

const NON_EMPTY_STRING = z.string().min(1);

const trackInfoSchema = z.object({
  name: NON_EMPTY_STRING,
  external_url: NON_EMPTY_STRING,
  preview_url: z.string().nullable(),
  artists: z.array(
    z.object({
      name: NON_EMPTY_STRING,
      external_url: NON_EMPTY_STRING,
    })
  ),
  album: z.object({
    name: NON_EMPTY_STRING,
    external_url: NON_EMPTY_STRING,
    image: z.object({
      url: NON_EMPTY_STRING,
      width: z.number(),
      height: z.number(),
    }),
  }),
});

const lyricsSchema = z
  .object({
    has_lipsync: z.boolean(),
    lines: z.array(
      z.object({
        words: NON_EMPTY_STRING,
        start_time: z.number(),
        end_time: z.number(),
      })
    ),
  })
  .nullable();

export const trackSchema = z.object({
  url: NON_EMPTY_STRING,
  track_info: trackInfoSchema,
  lyrics: lyricsSchema,
});

export type TrackInfo = z.infer<typeof trackInfoSchema>;
export type Lyrics = z.infer<typeof lyricsSchema>;
export type Track = z.infer<typeof trackSchema>;
