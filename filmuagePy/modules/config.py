import os
from dotenv import load_dotenv

load_dotenv()

srt_directory = os.getenv("SRT_DIRECTORY")
mkv_directory = os.getenv("MKV_DIRECTORY")
output_directory = os.getenv("OUTPUT_DIRECTORY")
