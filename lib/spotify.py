import os
import base64
import requests


def get_spotify_access_token() -> str | None:
    """
    Get the Spotify access token using a provided refresh token.

    This function makes a request to the Spotify API to obtain a new access token.

    Returns:
        str or None: If the request is successful, returns the `access_token`. If there is an error, returns None.
    """
    client_id = os.getenv('SPOTIFY_CLIENT_ID')
    client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
    refresh_token = os.getenv('SPOTIFY_REFRESH_TOKEN')

    if not client_id or not client_secret:
        print("Error: Missing Spotify client ID or secret")
        return None

    auth_header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + base64.b64encode(f'{client_id}:{client_secret}'.encode('utf-8')).decode('utf-8')
    }

    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
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
    Get the Spotify lyrics token using a sp_dc cookie.

    This function makes a request to Spotify to obtain a new access token.

    Returns:
        str or None: If the request is successful, returns the `access_token`. If there is an error, returns None.
    """

    sp_dc = os.getenv('SPOTIFY_SP_DC')

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'App-platform': 'WebPlayer',
        'Content-Type': 'text-/html; charset=UTF-8',
        'Cookie': f'sp_dc={sp_dc}'
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
    Get the Spotify track information for a given song ID.

    This function makes a request to the Spotify API to retrieve the track information for a given song ID.
    It also includes the access token in the request headers.

    Args:
        access_token (str): The access token to use for the request.
        song_id (str): The ID of the song to retrieve information for.

    Returns:
        dict: The response from the Spotify API.
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
