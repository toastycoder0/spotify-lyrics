import os
from dotenv import load_dotenv

load_dotenv()


ENV_VARS_KEYS = {
    'client_id': 'SPOTIFY_CLIENT_ID',
    'client_secret': 'SPOTIFY_CLIENT_SECRET',
    'refresh_token': 'SPOTIFY_REFRESH_TOKEN',
    'sp_dc': 'SPOTIFY_SP_DC'
}

MANDATORY_ENV_VARS = [ENV_VARS_KEYS[key] for key in ENV_VARS_KEYS]

for enviroment_variable in MANDATORY_ENV_VARS:
    if enviroment_variable not in os.environ:
        raise EnvironmentError(
            f"Failed because {enviroment_variable} is not set."
        )

SPOTIFY_CLIENT_ID = os.getenv(ENV_VARS_KEYS['client_id'])
SPOTIFY_CLIENT_SECRET = os.getenv(ENV_VARS_KEYS['client_secret'])
SPOTIFY_REFRESH_TOKEN = os.getenv(ENV_VARS_KEYS['refresh_token'])
SPOTIFY_SP_DC = os.getenv(ENV_VARS_KEYS['sp_dc'])

SPOTIFY_APP_PLATFORM = 'WebPlayer'
SPOTIFY_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
