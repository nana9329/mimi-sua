"""
Parse tin nhắn tiếng Việt chứa lượng sữa
"""
from datetime import datetime, timedelta
import re

def parse_date_from_text(text):
    """
    Parse ngày từ text: "hôm qua", "hôm kia", "3 ngày trước", etc.
    Return: date dạng YYYY-MM-DD, hoặc None nếu là hôm nay
    """
    text_lower = text.lower().strip()
    today = datetime.now().date()
    
    # Hôm qua
    if "hôm qua" in text_lower or "ngày hôm qua" in text_lower:
        target_date = today - timedelta(days=1)
        return target_date.strftime("%Y-%m-%d")
    
    # Hôm kia (2 ngày trước)
    if "hôm kia" in text_lower or "ngày hôm kia" in text_lower:
        target_date = today - timedelta(days=2)
        return target_date.strftime("%Y-%m-%d")
    
    # "N ngày trước"
    days_pattern = r'(\d+)\s*ngày\s*(?:trước|hôm)'
    days_match = re.search(days_pattern, text_lower)
    if days_match:
        days_ago = int(days_match.group(1))
        target_date = today - timedelta(days=days_ago)
        return target_date.strftime("%Y-%m-%d")
    
    # "thứ 2", "thứ 3",... (ngày trong tuần)
    weekday_map = {"thứ 2": 0, "thứ 3": 1, "thứ 4": 2, "thứ 5": 3, "thứ 6": 4, "thứ 7": 5, "chủ nhật": 6}
    for day_name, weekday in weekday_map.items():
        if day_name in text_lower:
            # Tìm ngày gần nhất với weekday đó trong tuần này
            current_weekday = today.weekday()
            days_diff = (weekday - current_weekday) % 7
            if days_diff == 0 and "tuần trước" not in text_lower:
                days_diff = 0  # Hôm nay nếu cùng ngày trong tuần
            else:
                days_diff = days_diff if days_diff > 0 else days_diff - 7
            target_date = today + timedelta(days=days_diff)
            if target_date <= today:
                return target_date.strftime("%Y-%m-%d")
    
    return None

def parse_message(text):
    """
    Parse: "120ml", "90ml lúc 8h", "bú mẹ 15p", "hôm qua 120ml lúc 8h"
    Return: {amount_ml, breastfeed_minutes, time, notes, date}
    """
    result = {
        "amount_ml": None,
        "breastfeed_minutes": None,
        "time": get_current_time(),
        "notes": "",
        "date": None  # None = today
    }
    
    if not text:
        return result
    
    text_lower = text.lower().strip()
    
    # Parse ngày
    parsed_date = parse_date_from_text(text)
    if parsed_date:
        result["date"] = parsed_date
    
    # Trích xuất giờ: "lúc 8h", "8:30", "8h30"
    time_pattern = r'(?:lúc\s*)?(\d{1,2})(?::(\d{2})|h(?:\s*(\d{2}))?)?'
    time_match = re.search(time_pattern, text_lower)
    if time_match:
        hour = int(time_match.group(1))
        minute = int(time_match.group(2)) if time_match.group(2) else (
            int(time_match.group(3)) if time_match.group(3) else 0
        )
        result["time"] = f"{hour:02d}:{minute:02d}"
    
    # Trích xuất ml: "120ml", "120 ml"
    ml_pattern = r'(\d+)\s*(?:ml|mL)'
    ml_match = re.search(ml_pattern, text)
    if ml_match:
        result["amount_ml"] = int(ml_match.group(1))
    
    # Trích xuất bú mẹ: "bú mẹ 15p", "15 phút bú mẹ"
    breast_pattern = r'(?:bú\s*(?:mẹ)?\s*)?(\d+)\s*(?:p|phút)\s*(?:bú\s*mẹ)?'
    breast_match = re.search(breast_pattern, text_lower)
    if breast_match:
        result["breastfeed_minutes"] = int(breast_match.group(1))
    
    # Ghi chú
    if "nôn trớ" in text_lower or "nôn" in text_lower:
        result["notes"] = "nôn trớ"
    elif "ngủ quên" in text_lower or "ngủ" in text_lower:
        result["notes"] = "ngủ quên"
    elif "thừa" in text_lower or "còn" in text_lower:
        result["notes"] = "còn thừa"
    
    return result

def get_current_time():
    """Lấy giờ hiện tại dạng HH:MM"""
    now = datetime.now()
    return now.strftime("%H:%M")

def get_current_date():
    """Lấy ngày hôm nay dạng YYYY-MM-DD"""
    today = datetime.now()
    return today.strftime("%Y-%m-%d")

def is_valid_feeding(parsed):
    """Kiểm tra dữ liệu parsed có hợp lệ không"""
    return (parsed.get("amount_ml") and parsed["amount_ml"] > 0) or \
           (parsed.get("breastfeed_minutes") and parsed["breastfeed_minutes"] > 0)

def format_feeding_message(parsed, total, target_date=None):
    """Format tin nhắn phản hồi cho user"""
    message = "✅ Đã ghi nhận:\n"
    
    if parsed.get("amount_ml"):
        message += f"🍼 {parsed['amount_ml']}ml"
    
    if parsed.get("breastfeed_minutes"):
        if parsed.get("amount_ml"):
            message += " + "
        message += f"🤱 {parsed['breastfeed_minutes']}p"
    
    if parsed.get("notes"):
        message += f" ({parsed['notes']})"
    
    # Hiển thị date nếu không phải hôm nay
    if target_date and target_date != get_current_date():
        message += f" [📅 {target_date}]"
    
    message += f"\n\n📊 Tổng: {total}ml / 800ml\n"
    
    percentage = round((total / 800) * 100)
    message += f"📈 {percentage}%"
    
    if percentage >= 100:
        message += " ✨ Tuyệt vời!"
    
    return message
