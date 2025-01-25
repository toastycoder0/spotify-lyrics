from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from lib.url import validate_spotify_url, extract_spotify_track_id_from_url
from lib.spotify import get_spotify_access_token, get_spotify_track_info, get_spotify_lyrics_token
import uvicorn

load_dotenv()

app = FastAPI()


@app.get('/lyrics')
def get_song_lyrics(song_url: str = Query(..., description='The Spotify song URL', alias='song_url', title='Song URL')):
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

    return {
        'track_info': track_info,
        'lyrics_token': lyrics_token
    }


if __name__ == '__main__':
    uvicorn.run(app='main:app', host='0.0.0.0', port=4000, reload=True)
