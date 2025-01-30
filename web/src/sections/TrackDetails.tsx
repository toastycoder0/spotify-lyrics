import { TrackInfo } from "@/components/TrackInfo";
import { TrackLyrics } from "@/components/TrackLyrics";
import { Loading } from "@/sections/Loading";
import { Error } from "@/sections/Error";
import { useTrack } from "@/hooks/useTrack";

const TrackDetails = () => {
  const { data, error } = useTrack();

  if (error) {
    return <Error error={error} />;
  }

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 md:flex-row">
      <TrackInfo
        info={data.track_info}
        trackUrl={data.url}
        isDisabled={!data.lyrics}
      />
      <TrackLyrics lyrics={data.lyrics} />
    </div>
  );
};

export { TrackDetails };
