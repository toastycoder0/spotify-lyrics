import re

regex = r"https://open.spotify.com/track/"


def validate_spotify_url(url):
    """
    Validates whether a given URL matches the pattern for a Spotify track URL.

    Args:
        url (str): The URL to validate.

    Returns:
        bool: True if the URL matches the pattern, otherwise False.
    """
    if re.match(regex, url):
        return True
    return False


def extract_spotify_track_id(url):
    """
    Extracts the track ID from a Spotify track URL.

    Args:
        url (str): The Spotify URL to process.

    Returns:
        str: The track ID if the URL is valid, otherwise None.
    """
    if "open.spotify.com/track/" in url:
        return url.split("/track/")[1].split("?")[0]
    return None
