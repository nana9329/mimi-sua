"""
API Server - Kết nối Bot + Dashboard
Giúp Dashboard đọc data từ Bot
"""
from flask import Flask, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import logging

app = Flask(__name__)

# CORS Configuration - Production Ready
cors_origins = os.getenv('CORS_ORIGINS', '*').split(',')
CORS(app, resources={
    r"/api/*": {
        "origins": cors_origins,
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Path to bot data
BOT_DATA_PATH = "data/feedings.json"

def get_feedings():
    """Đọc file feedings.json từ Bot"""
    if not os.path.exists(BOT_DATA_PATH):
        return []
    
    try:
        with open(BOT_DATA_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def get_today_date():
    """Lấy ngày hôm nay"""
    return datetime.now().strftime("%Y-%m-%d")

@app.route('/api/feedings/today', methods=['GET'])
def today_feedings():
    """API: Lấy feedings hôm nay"""
    date = get_today_date()
    all_feedings = get_feedings()
    
    today_feedings = [f for f in all_feedings if f.get('date') == date]
    
    return jsonify({
        "date": date,
        "feedings": today_feedings,
        "total_ml": sum(f.get('amount_ml', 0) for f in today_feedings)
    })

@app.route('/api/feedings', methods=['GET'])
def all_feedings():
    """API: Lấy tất cả feedings"""
    return jsonify({
        "feedings": get_feedings()
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        "status": "ok",
        "message": "Mimi Sữa API running"
    })

if __name__ == '__main__':
    print("🔌 Mimi Sữa API Server running on http://localhost:5000")
    print("📊 API Endpoints:")
    print("  - GET /api/health")
    print("  - GET /api/feedings/today")
    print("  - GET /api/feedings")
    
    # Production vs Development
    is_prod = os.getenv('FLASK_ENV') == 'production'
    port = int(os.getenv('PORT', 5000))
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=not is_prod,
        use_reloader=not is_prod
    )
