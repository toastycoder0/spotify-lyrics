const Loading = () => {
  return (
    <article className="flex flex-col items-center gap-4 text-center m-auto">
      <span
        className="size-28 bg-gradient-to-b from-transparent via-white to-transparent bg-[length:25px_400%] bg-no-repeat animate-matrix"
        style={{
          backgroundImage: `
        linear-gradient(#0000 calc(1*100%/6),#fff 0 calc(3*100%/6),#0000 0),
        linear-gradient(#0000 calc(2*100%/6),#fff 0 calc(4*100%/6),#0000 0),
        linear-gradient(#0000 calc(3*100%/6),#fff 0 calc(5*100%/6),#0000 0)`,
        }}
      />

      <h1 className="text-2xl font-semibold">Loding lyrics...</h1>

      <p className="text-spotify-gray w-full max-w-72">
        Please wait while we fetch the lyrics for this track.
      </p>
    </article>
  );
};

export { Loading };
