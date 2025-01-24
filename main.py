from fastapi import FastAPI, HTTPException, Query
from lib.url import validate_spotify_url, extract_spotify_track_id
import uvicorn

app = FastAPI()


invalid_url_message = "Invalid URL"


@app.get("/lyrics")
def get_song_lyrics(song_url: str = Query(..., description="The Spotify song URL", alias="song_url", title="Song URL")):
    if not validate_spotify_url(song_url):
        raise HTTPException(status_code=400, detail=invalid_url_message)

    song_id = extract_spotify_track_id(song_url)

    if not song_id:
        raise HTTPException(status_code=400, detail=invalid_url_message)

    return {"song_id": song_id}


if __name__ == "__main__":
    uvicorn.run(app="main:app", host="0.0.0.0", port=4000, reload=True)
