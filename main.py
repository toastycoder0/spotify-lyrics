import uvicorn
import os
import subprocess
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from lib.url import validate_spotify_url, extract_spotify_track_id_from_url
from lib.spotify import get_spotify_access_token, get_spotify_track_info, get_spotify_lyrics_token, get_spotify_lyrics
from models.lyrics import LyricsResponse

load_dotenv()

app = FastAPI(
    title="Spotify Lyrics",
    description="Get lyrics and track info for a Spotify track.",
    version="1.0.0"
)


web = os.path.join(os.path.dirname(__file__), "./web/dist")

if os.path.exists(web):
    app.mount("/", StaticFiles(directory=web, html=True), name="Web Page")
else:
    subprocess.Popen(
        ["pnpm", "dev"],
        cwd=os.path.join(os.path.dirname(__file__), "./web")
    )


@app.get(
    '/lyrics',
    response_model=LyricsResponse,
    summary="Fetch Lyrics and Track Info",
    description=(
        "This endpoint retrieves the lyrics and metadata of a Spotify track. "
        "Provide the Spotify track URL, and the API will return track details along with synchronized lyrics, if available."
    ),
    response_description="Returns the track information and lyrics."
)
def get_song_lyrics(
    song_url: str = Query(
        ...,
        description="The Spotify URL of the song to retrieve lyrics for.",
        alias='song_url',
        title='Song URL'
    )
):
    """
    Fetches the lyrics and metadata of a Spotify track.

    Args:
        song_url (str): The Spotify URL of the track. The URL must be valid and include the Spotify track ID.

    Returns:
        LyricsResponse: A detailed response containing:
            - `track_info`: Metadata about the Spotify track, including title, artists, album, and preview URL.
            - `lyrics`: Lyrics data, including whether the lyrics are synchronized and the timestamped lines.

    Raises:
        HTTPException: Raised in the following cases:
            - **400**: If the URL is invalid or the track ID cannot be extracted.
            - **401**: If authentication fails while retrieving access tokens.
            - **404**: If the track metadata or lyrics cannot be fetched.
    """
    if not validate_spotify_url(song_url):
        raise HTTPException(
            status_code=400,
            detail='Error: Invalid URL. Please provide a valid Spotify URL.'
        )

    song_id = extract_spotify_track_id_from_url(song_url)

    if not song_id:
        raise HTTPException(
            status_code=400,
            detail='Error: Failed to extract song ID from URL'
        )

    access_token = get_spotify_access_token()

    if not access_token:
        raise HTTPException(
            status_code=401,
            detail='Error: Failed to get access token'
        )

    track_info = get_spotify_track_info(access_token, song_id)

    if not track_info:
        raise HTTPException(
            status_code=404,
            detail='Error: Failed to get track info'
        )

    lyrics_token = get_spotify_lyrics_token()

    if not lyrics_token:
        raise HTTPException(
            status_code=401,
            detail='Error: Failed to get the access token for the lyrics'
        )

    lyrics = get_spotify_lyrics(lyrics_token, song_id)

    return {
        'track_info': track_info,
        'lyrics': lyrics
    }


if __name__ == '__main__':
    uvicorn.run(app='main:app', host='0.0.0.0', port=4000, reload=True)
