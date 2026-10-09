import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DB_PATH = BASE_DIR / "edusphere.db"

raw_db_url = os.getenv("DATABASE_URL")
if not raw_db_url or raw_db_url == "sqlite:///./edusphere.db":
    DATABASE_URL = f"sqlite:///{DEFAULT_DB_PATH.as_posix()}"
else:
    DATABASE_URL = raw_db_url

SECRET_KEY = os.getenv("SECRET_KEY", "edusphere_super_secret_jwt_key_2026_btech_platform")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "43200"))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
