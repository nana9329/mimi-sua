"""
Telegram Bot chính
Ngôn ngữ: Python
Library: python-telegram-bot
"""
import os
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, CallbackQueryHandler

from parser import parse_message, get_current_date, is_valid_feeding, format_feeding_message
from database import add_feeding, get_today_feedings, get_today_total, remove_last_feeding

# Load token từ .env
load_dotenv()
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# Lưu history cho undo
user_history = {}

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Xử lý /start"""
    chat_id = update.effective_chat.id
    
    message = (
        "👋 Xin chào! Tôi là Mimi - Bot ghi nhận lượng sữa cho bé.\n\n"
        "📝 Cách sử dụng:\n"
        "• Gõ: 120ml → ghi nhận 120ml\n"
        "• Gõ: 90ml lúc 8h → ghi nhận 90ml vào lúc 8h\n"
        "• Gõ: bú mẹ 15p → ghi nhận bú mẹ 15 phút\n"
        "• Gõ: /today → xem tổng hôm nay\n"
        "• Gõ: /undo → xoá bản ghi gần nhất\n\n"
        "📅 Ghi nhận ngày khác:\n"
        "• hôm qua 120ml lúc 8h\n"
        "• hôm kia 90ml\n"
        "• 3 ngày trước 100ml lúc 7h\n\n"
        "Hoặc bấm nút nhanh:"
    )
    
    keyboard = [
        [
            InlineKeyboardButton("60ml", callback_data="quick_60"),
            InlineKeyboardButton("90ml", callback_data="quick_90"),
            InlineKeyboardButton("120ml", callback_data="quick_120")
        ],
        [
            InlineKeyboardButton("150ml", callback_data="quick_150"),
            InlineKeyboardButton("Xem hôm nay", callback_data="today")
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await context.bot.send_message(chat_id=chat_id, text=message, reply_markup=reply_markup)

async def today(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Xử lý /today - xem tổng hôm nay"""
    chat_id = update.effective_chat.id
    date = get_current_date()
    total = get_today_total(date)
    feedings = get_today_feedings(date)
    
    message = f"📊 Tổng hôm nay: {total}ml / 800ml\n"
    percentage = round((total / 800) * 100)
    message += f"📈 {percentage}%\n\n"
    
    if not feedings:
        message += "Chưa có bản ghi nào hôm nay."
    else:
        message += "⏰ Chi tiết:\n"
        for idx, f in enumerate(feedings, 1):
            feeding_text = f"{idx}. {f['time']}"
            if f['amount_ml']:
                feeding_text += f" 🍼 {f['amount_ml']}ml"
            if f['breastfeed_minutes']:
                feeding_text += f" 🤱 {f['breastfeed_minutes']}p"
            if f['notes']:
                feeding_text += f" ({f['notes']})"
            message += feeding_text + "\n"
    
    await context.bot.send_message(chat_id=chat_id, text=message)

async def undo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Xử lý /undo - xoá bản ghi gần nhất"""
    chat_id = update.effective_chat.id
    
    removed = remove_last_feeding()
    if removed:
        msg = f"🗑️ Đã xoá: {removed['time']} - {removed['amount_ml']}ml"
        if removed['breastfeed_minutes']:
            msg += f" bú {removed['breastfeed_minutes']}p"
        await context.bot.send_message(chat_id=chat_id, text=msg)
    else:
        await context.bot.send_message(chat_id=chat_id, text="Không có bản ghi nào để xoá.")

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Xử lý callback từ nút inline"""
    query = update.callback_query
    chat_id = query.message.chat_id
    date = get_current_date()
    
    from datetime import datetime
    time_now = datetime.now().strftime("%H:%M")
    
    if query.data.startswith("quick_"):
        # Nút quick ml
        amount = int(query.data.split("_")[1])
        add_feeding(date, time_now, amount, 0, "")
        
        total = get_today_total(date)
        message = format_feeding_message(
            {"amount_ml": amount, "breastfeed_minutes": 0, "notes": ""},
            total
        )
        
        # Update message với nút mới
        keyboard = [
            [
                InlineKeyboardButton("60ml", callback_data="quick_60"),
                InlineKeyboardButton("90ml", callback_data="quick_90"),
                InlineKeyboardButton("120ml", callback_data="quick_120")
            ],
            [
                InlineKeyboardButton("150ml", callback_data="quick_150"),
                InlineKeyboardButton("Xem hôm nay", callback_data="today")
            ]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(text=message, reply_markup=reply_markup)
    
    elif query.data == "today":
        # Nút xem hôm nay
        total = get_today_total(date)
        feedings = get_today_feedings(date)
        
        message = f"📊 Tổng hôm nay: {total}ml / 800ml\n"
        percentage = round((total / 800) * 100)
        message += f"📈 {percentage}%\n\n"
        
        if not feedings:
            message += "Chưa có bản ghi nào hôm nay."
        else:
            message += "⏰ Chi tiết:\n"
            for idx, f in enumerate(feedings, 1):
                feeding_text = f"{idx}. {f['time']}"
                if f['amount_ml']:
                    feeding_text += f" 🍼 {f['amount_ml']}ml"
                if f['breastfeed_minutes']:
                    feeding_text += f" 🤱 {f['breastfeed_minutes']}p"
                if f['notes']:
                    feeding_text += f" ({f['notes']})"
                message += feeding_text + "\n"
        
        await query.edit_message_text(text=message)
    
    await query.answer()

def get_keyboard():
    """Tạo keyboard với nút nhanh"""
    keyboard = [
        [
            InlineKeyboardButton("60ml", callback_data="quick_60"),
            InlineKeyboardButton("90ml", callback_data="quick_90"),
            InlineKeyboardButton("120ml", callback_data="quick_120")
        ],
        [
            InlineKeyboardButton("150ml", callback_data="quick_150"),
            InlineKeyboardButton("Xem hôm nay", callback_data="today")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Xử lý tin nhắn tự nhiên"""
    chat_id = update.effective_chat.id
    text = update.message.text
    
    # Bỏ qua lệnh
    if text.startswith("/"):
        return
    
    parsed = parse_message(text)
    
    if not is_valid_feeding(parsed):
        await context.bot.send_message(
            chat_id=chat_id,
            text=(
                "❓ Tôi không hiểu. Hãy gõ:\n"
                "• 120ml\n"
                "• 90ml lúc 8h\n"
                "• bú mẹ 15p\n\n"
                "📅 Ghi nhận ngày khác:\n"
                "• hôm qua 120ml lúc 8h\n"
                "• hôm kia 90ml\n"
                "• 3 ngày trước 100ml lúc 7h"
            ),
            reply_markup=get_keyboard()
        )
        return
    
    # Dùng date từ parsed, nếu không có thì dùng hôm nay
    date = parsed.get("date") or get_current_date()
    add_feeding(date, parsed["time"], parsed["amount_ml"], parsed["breastfeed_minutes"], parsed["notes"])
    
    # Tính tổng cho ngày đó (hoặc hôm nay nếu tính phần trăm)
    total = get_today_total(date)
    message = format_feeding_message(parsed, total, date)
    
    # Gửi với nút button
    await context.bot.send_message(
        chat_id=chat_id, 
        text=message,
        reply_markup=get_keyboard()
    )
    
    # Lưu history cho undo
    if chat_id not in user_history:
        user_history[chat_id] = []
    user_history[chat_id].append({
        "date": date,
        "time": parsed["time"],
        "amount_ml": parsed["amount_ml"],
        "breastfeed_minutes": parsed["breastfeed_minutes"],
        "notes": parsed["notes"]
    })

def main():
    """Khởi động bot"""
    app = Application.builder().token(TOKEN).build()
    
    # Handlers
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("today", today))
    app.add_handler(CommandHandler("undo", undo))
    app.add_handler(CallbackQueryHandler(button_callback))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    print("🤖 Mimi Sữa Bot đang hoạt động...\n")
    
    app.run_polling()

if __name__ == "__main__":
    main()
