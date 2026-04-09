"""
Entry point - Khởi động Bot Telegram + Flask API cùng lúc
"""
import threading
import os
from dotenv import load_dotenv

# Load env vars
load_dotenv()

def run_api():
    """Chạy Flask API server"""
    from api import app
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

def run_bot():
    """Chạy Telegram Bot"""
    from bot import main
    main()

if __name__ == "__main__":
    # Khởi động API trong thread riêng
    api_thread = threading.Thread(target=run_api, daemon=True)
    api_thread.start()
    
    # Khởi động Bot trong main thread
    run_bot()
