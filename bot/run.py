"""
Simple entry point - Chỉ chạy Telegram Bot
"""
import os
from dotenv import load_dotenv

# Load env vars
load_dotenv()

if __name__ == "__main__":
    from bot import main
    main()

