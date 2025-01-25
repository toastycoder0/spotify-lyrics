import os
import base64
import requests


def get_spotify_access_token():
    """
    Get the Spotify access token using a provided refresh token.

    This function makes a request to the Spotify API to obtain a new access token and, optionally,
    a new refresh token using the credentials configured in the environment variables.

    Returns:
        dict or None: If the request is successful, returns a dictionary with the `access_token` 
                      and `refresh_token`. If there is an error, returns None.
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
