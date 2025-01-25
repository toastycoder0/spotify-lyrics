from pydantic import BaseModel
from typing import List, Optional


class Artist(BaseModel):
    name: str
    external_url: str


class AlbumImage(BaseModel):
    url: str
    width: int
    height: int


class Album(BaseModel):
    name: str
    external_url: str
    image: AlbumImage


class TrackInfo(BaseModel):
    name: str
    external_url: str
    preview_url: Optional[str]
    artists: List[Artist]
    album: Album


class LyricLine(BaseModel):
    words: str
    start_time: int
    end_time: int


class Lyrics(BaseModel):
    has_lipsync: bool
    lines: List[LyricLine]


class LyricsResponse(BaseModel):
    track_info: TrackInfo
    lyrics: Optional[Lyrics]
