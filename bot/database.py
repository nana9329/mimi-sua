"""
Database: lưu dữ liệu vào JSON file
"""
import json
import os
from parser import get_current_date

DB_PATH = "data/feedings.json"

def ensure_db_exists():
    """Tạo file database nếu chưa có"""
    if not os.path.exists("data"):
        os.makedirs("data")
    
    if not os.path.exists(DB_PATH):
        with open(DB_PATH, "w") as f:
            json.dump([], f)

def add_feeding(date, time, amount_ml, breastfeed_minutes, notes=""):
    """Thêm bản ghi feeding"""
    ensure_db_exists()
    
    with open(DB_PATH, "r") as f:
        data = json.load(f)
    
    data.append({
        "date": date,
        "time": time,
        "amount_ml": amount_ml or 0,
        "breastfeed_minutes": breastfeed_minutes or 0,
        "notes": notes or ""
    })
    
    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=2)

def get_today_feedings(date):
    """Lấy tất cả feedings hôm nay"""
    ensure_db_exists()
    
    with open(DB_PATH, "r") as f:
        data = json.load(f)
    
    return [item for item in data if item["date"] == date]

def get_today_total(date):
    """Tính tổng ml hôm nay (tính cả bú mẹ)"""
    feedings = get_today_feedings(date)
    total = 0
    
    for f in feedings:
        ml = f.get("amount_ml", 0) or 0
        breastfeed_minutes = f.get("breastfeed_minutes", 0) or 0
        
        # 1 phút bú mẹ ≈ 10ml
        breastfeed_ml = breastfeed_minutes * 10
        total += ml + breastfeed_ml
    
    return total

def remove_last_feeding():
    """Xoá bản ghi cuối cùng (undo)"""
    ensure_db_exists()
    
    with open(DB_PATH, "r") as f:
        data = json.load(f)
    
    if data:
        removed = data.pop()
        with open(DB_PATH, "w") as f:
            json.dump(data, f, indent=2)
        return removed
    
    return None
