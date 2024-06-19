import os

APP_MODE = os.getenv('APP_MODE', 'development')

if APP_MODE == 'production':
    ENV_FILE = '.env.production'
else:
    ENV_FILE = '.env.development'