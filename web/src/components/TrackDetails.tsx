import { TrackInfo } from "@/components/TrackInfo";
import { TrackLyrics } from "@/components/TrackLyrics";
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

      <TrackLyrics lyrics={data.lyrics} />
    </div>
  );
};

export { TrackDetails };
