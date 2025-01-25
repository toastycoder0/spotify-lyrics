import os
import base64
import requests
from core.config import SPOTIFY_APP_PLATFORM, SPOTIFY_USER_AGENT, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, SPOTIFY_SP_DC


def get_spotify_access_token() -> str | None:
    """
    Retrieves a new Spotify access token using the refresh token.

    This function makes a request to the Spotify API to obtain a new access token. 
    The client credentials and refresh token are loaded from environment variables.

    Returns:
        str: The new Spotify access token if the request is successful.
        None: Returns None if the client credentials are missing, the request fails, or an exception occurs.

    Raises:
        None: Errors are handled internally and logged using print statements.
    """

    auth_header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + base64.b64encode(f'{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}'.encode('utf-8')).decode('utf-8')
    }

    data = {
        'grant_type': 'refresh_token',
        'refresh_token': SPOTIFY_REFRESH_TOKEN
    }

    try:
        response = requests.post(
            'https://accounts.spotify.com/api/token',
            headers=auth_header,
            data=data
        )

        if response.status_code == 200:
            body = response.json()

            access_token = body['access_token']

            return access_token
        else:
            print(response.status_code)
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None


def get_spotify_lyrics_token() -> str | None:
    """
    Retrieves a Spotify lyrics access token using the `sp_dc` cookie.

    This function sends a request to Spotify's web player endpoint to obtain an access token 
    specifically for fetching lyrics. The `sp_dc` cookie is required and is loaded from the 
    environment variables.

    Returns:
        str: The Spotify lyrics access token if the request is successful.
        None: Returns None if the `sp_dc` cookie is missing, the request fails, or an exception occurs.

    Raises:
        None: Errors are handled internally and logged using print statements.
    """

    headers = {
        'User-Agent': SPOTIFY_USER_AGENT,
        'App-platform': SPOTIFY_APP_PLATFORM,
        'Content-Type': 'text-/html; charset=UTF-8',
        'Cookie': f'sp_dc={SPOTIFY_SP_DC}'
    }

    try:
        response = requests.get(
            'https://open.spotify.com/get_access_token?reason=transport&productType=web_player',
            headers=headers
        )

        if response.status_code == 200:
            body = response.json()

            access_token = body['accessToken']

            return access_token
        else:
            print(response.status_code)
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None


def get_spotify_track_info(access_token: str, song_id: str) -> dict:
    """
    Retrieves detailed information about a specific Spotify track.

    This function fetches information about a track from the Spotify API, including details about 
    the track's name, artists, album, and a preview URL (if available).

    Parameters:
        access_token (str): The Spotify access token used for authentication.
        song_id (str): The ID of the Spotify track to retrieve information for.

    Returns:
        dict: A dictionary containing the following keys:
            - `name` (str): The name of the track.
            - `external_url` (str): The Spotify URL for the track.
            - `preview_url` (str or None): The URL for a 30-second preview of the track (if available).
            - `artists` (list): A list of dictionaries, where each dictionary contains:
                - `name` (str): The name of the artist.
                - `external_url` (str): The Spotify URL for the artist.
            - `album` (dict): A dictionary containing:
                - `name` (str): The name of the album.
                - `external_url` (str): The Spotify URL for the album.
                - `image` (dict): The album's cover image with keys `url`, `width`, and `height`.
        None: Returns None if the request fails or an exception occurs.

    Raises:
        None: Errors are handled internally and logged using print statements.
    """

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    try:
        response = requests.get(
            f'https://api.spotify.com/v1/tracks/{song_id}',
            headers=headers
        )

        if response.status_code == 200:
            body = response.json()

            artists = []

            for artist in body['artists']:
                artists.append({
                    'name': artist['name'],
                    'external_url': artist['external_urls']['spotify']
                })

            album_images = body['album']['images']

            # Sort the album images by width in descending order and take the largest image
            album_image = max(album_images, key=lambda x: x['width'])

            album = {
                'name': body['album']['name'],
                'external_url': body['album']['external_urls']['spotify'],
                'image': album_image
            }

            return {
                'name': body['name'],
                'external_url': body['external_urls']['spotify'],
                'preview_url': body['preview_url'],
                'artists': artists,
                'album': album
            }
        else:
            print(response.status_code)
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None


def get_spotify_lyrics(access_token: str, song_id: str) -> dict:
    """
    Retrieves synchronized lyrics for a given Spotify track.

    This function makes a request to Spotify's lyrics API to fetch lyrics for a specific song. 
    The lyrics include synchronization data such as start and end timestamps for each line.

    Parameters:
        access_token (str): The Spotify access token used for authentication.
        song_id (str): The ID of the Spotify track for which lyrics are being retrieved.

    Returns:
        dict: A dictionary containing the following keys:
            - `has_lipsync` (bool): Indicates whether the lyrics are line-synced.
            - `lines` (list): A list of dictionaries, where each dictionary contains:
                - `words` (str): The text of the lyric line.
                - `start_time` (int): The start timestamp of the lyric line in milliseconds.
                - `end_time` (int): The end timestamp of the lyric line in milliseconds.
        None: Returns None if the request fails or an exception occurs.

    Raises:
        None: Errors are handled internally and logged using print statements.
    """

    url_params = '?format=json&vocalRemoval=false&market=from_token'

    headers = {
        'User-Agent': SPOTIFY_USER_AGENT,
        'App-platform': SPOTIFY_APP_PLATFORM,
        'Authorization': f'Bearer {access_token}'
    }

    try:
        response = requests.get(
            'https://spclient.wg.spotify.com/color-lyrics/v2/track/' + song_id + url_params,
            headers=headers
        )

        if response.status_code == 200 and response.json():
            body = response.json()

            has_lipsync = body['lyrics']['syncType'] == 'LINE_SYNCED'
            lyrics_lines = body['lyrics']['lines']

            lines = []

            for line in lyrics_lines:
                words = line['words']
                start_time = line['startTimeMs']
                end_time = line['endTimeMs']

                lines.append({
                    'words': words,
                    'start_time': int(start_time),
                    'end_time': int(end_time)
                })

            return {
                'has_lipsync': has_lipsync,
                'lines': lines
            }
        else:
            print(response.status_code)
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None
