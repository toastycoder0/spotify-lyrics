import type { FC } from "react";
import type { ErrorWithCode } from "@/constants/error";

interface ErrorProps {
  error: ErrorWithCode;
}

const Error: FC<ErrorProps> = ({ error }) => {
  return (
    <article className="flex flex-col items-center gap-4 text-center m-auto">
      <p className="font-bold font-spotifyMixVariable text-8xl xl:text-9xl">
        {error.code}
      </p>

      <h1 className="text-2xl font-semibold">
        Ups looks like something went wrong.
      </h1>

      <p className="text-spotify-gray w-full max-w-72">{error.message}</p>

      <a
        href="/"
        className="bg-white h-14 flex items-center text-black py-2 px-8 rounded-full"
      >
        Return to search
      </a>
    </article>
  );
};

export { Error };
