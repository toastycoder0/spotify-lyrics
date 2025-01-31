export const convertMsToSeconds = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);

  const minutesWithLeadingZero = minutes % 60;
  const secondsWithLeadingZero = seconds % 60;

  return `${minutesWithLeadingZero < 10 ? "0" : ""}${minutes}:${
    secondsWithLeadingZero < 10 ? "0" : ""
  }${secondsWithLeadingZero}`;
};
