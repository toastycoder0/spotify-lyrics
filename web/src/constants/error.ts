export interface ErrorWithCode {
  code: number;
  message: string;
}

export const ERRORS = {
  NO_TRACK_ID_FOUND: {
    code: 404,
    message: "No track ID found in URL",
  },
  FAILED_TO_FETCH_TRACK_DATA: {
    code: 404,
    message: "Failed to fetch track data",
  },
  FAILED_TO_PARSE_TRACK_DATA: {
    code: 404,
    message: "Failed to parse track data",
  },
  UNKNOWN_TRACK_ERROR: {
    code: 500,
    message: "An unknown error occurred",
  },
};
