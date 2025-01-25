import re

regex = r"https://open.spotify.com/track/"


def validate_spotify_url(url: str) -> bool:
    """
    Validates whether a given URL matches the pattern for a Spotify track URL.

    Args:
        url (str): The URL to validate.

    Returns:
        bool: True if the URL matches the pattern, otherwise False.
    """
    return bool(re.match(regex, url))


def extract_spotify_track_id_from_url(url: str) -> str | None:
    """
    Extracts the track ID from a Spotify track URL.

    Args:
        url (str): The Spotify URL to process.

    Returns:
        str: The track ID if the URL is valid, otherwise None.
    """
    try:
        track_id = url.split("/track/")[1]
        return track_id.split("?")[0]
    except IndexError:
        return None
