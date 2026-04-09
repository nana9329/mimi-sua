import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { parseMessage, getCurrentDate, isValidFeeding, formatFeedingMessage } from './parser.js';
import { LocalDB } from './sheets.js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Dùng LocalDB (lưu vào file JSON) thay cho Google Sheets lúc đầu
const db = new LocalDB();

// Lưu lịch sử messages để fix lỗi
const userHistory = {};

console.log('🤖 Mimi Sữa Bot đang hoạt động...\n');

/**
 * /start - Hiển thị menu chính
 */
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `👋 Xin chào! Tôi là Mimi - Bot ghi nhận lượng sữa cho bé.\n\n` +
    `📝 Cách sử dụng:\n` +
    `• Gõ: "120ml" → ghi nhận 120ml\n` +
    `• Gõ: "90ml lúc 8h" → ghi nhận 90ml vào lúc 8h\n` +
    `• Gõ: "bú mẹ 15p" → ghi nhận bú mẹ 15 phút\n` +
    `• Gõ: "/today" → xem tổng hôm nay\n` +
    `• Gõ: "/undo" → xoá bản ghi gần nhất\n\n` +
    `Nút nhanh:`;

  bot.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '60ml', callback_data: 'quick_60' },
          { text: '90ml', callback_data: 'quick_90' },
          { text: '120ml', callback_data: 'quick_120' }
        ],
        [
          { text: '150ml', callback_data: 'quick_150' },
          { text: 'Xem hôm nay', callback_data: 'today' }
        ]
      ]
    }
  });
});

/**
 * /today - Xem tổng hôm nay
 */
bot.onText(/\/today/, async (msg) => {
  const chatId = msg.chat.id;
  const date = getCurrentDate();
  const total = await db.getTodayTotal(date);
  const feedings = db.getTodayFeedings(date);

  let message = `📊 Tổng hôm nay: ${total}ml / 800ml\n`;
  const percentage = Math.round((total / 800) * 100);
  message += `📈 ${percentage}%\n\n`;

  if (feedings.length === 0) {
    message += "Chưa có bản ghi nào hôm nay.";
  } else {
    message += "⏰ Chi tiết:\n";
    feedings.forEach((f, idx) => {
      let feedingText = `${idx + 1}. ${f.time}`;
      if (f.amount_ml) feedingText += ` 🍼 ${f.amount_ml}ml`;
      if (f.breastfeed_minutes) feedingText += ` 🤱 ${f.breastfeed_minutes}p`;
      if (f.notes) feedingText += ` (${f.notes})`;
      message += feedingText + '\n';
    });
  }

  bot.sendMessage(chatId, message);
});

/**
 * /undo - Xoá bản ghi gần nhất
 */
bot.onText(/\/undo/, (msg) => {
  const chatId = msg.chat.id;
  // TODO: Implement undo (cần lưu history)
  bot.sendMessage(chatId, "🔕 Tính năng /undo sẽ cập nhật sau.");
});

/**
 * Nút nhanh (quick buttons)
 */
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  const date = getCurrentDate();
  const time = new Date().toTimeString().slice(0, 5);

  if (data.startsWith('quick_')) {
    const amount = parseInt(data.split('_')[1]);
    db.addFeeding(date, time, amount, 0, '');

    const total = await db.getTodayTotal(date);
    const message = formatFeedingMessage(
      { amount_ml: amount, breastfeed_minutes: 0, notes: '' },
      total
    );

    bot.editMessageText(message, {
      chat_id: chatId,
      message_id: query.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '60ml', callback_data: 'quick_60' },
            { text: '90ml', callback_data: 'quick_90' },
            { text: '120ml', callback_data: 'quick_120' }
          ],
          [
            { text: '150ml', callback_data: 'quick_150' },
            { text: 'Xem hôm nay', callback_data: 'today' }
          ]
        ]
      }
    });
  }

  if (data === 'today') {
    const total = await db.getTodayTotal(date);
    const feedings = db.getTodayFeedings(date);

    let message = `📊 Tổng hôm nay: ${total}ml / 800ml\n`;
    const percentage = Math.round((total / 800) * 100);
    message += `📈 ${percentage}%\n\n`;

    if (feedings.length === 0) {
      message += "Chưa có bản ghi nào hôm nay.";
    } else {
      message += "⏰ Chi tiết:\n";
      feedings.forEach((f, idx) => {
        let feedingText = `${idx + 1}. ${f.time}`;
        if (f.amount_ml) feedingText += ` 🍼 ${f.amount_ml}ml`;
        if (f.breastfeed_minutes) feedingText += ` 🤱 ${f.breastfeed_minutes}p`;
        if (f.notes) feedingText += ` (${f.notes})`;
        message += feedingText + '\n';
      });
    }

    bot.editMessageText(message, {
      chat_id: chatId,
      message_id: query.message.message_id
    });
  }

  bot.answerCallbackQuery(query.id);
});

/**
 * Xử lý tin nhắn tự nhiên
 */
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Bỏ qua các lệnh đã xử lý
  if (text.startsWith('/')) return;

  const parsed = parseMessage(text);

  if (!isValidFeeding(parsed)) {
    bot.sendMessage(chatId, 
      "❓ Tôi không hiểu. Hãy gõ:\n" +
      "• 120ml\n" +
      "• 90ml lúc 8h\n" +
      "• bú mẹ 15p"
    );
    return;
  }

  const date = getCurrentDate();
  db.addFeeding(date, parsed.time, parsed.amount_ml, parsed.breastfeed_minutes, parsed.notes);

  const total = await db.getTodayTotal(date);
  const message = formatFeedingMessage(parsed, total);

  bot.sendMessage(chatId, message);

  // Lưu history để dùng cho /undo
  if (!userHistory[chatId]) userHistory[chatId] = [];
  userHistory[chatId].push({
    date, 
    time: parsed.time,
    amount_ml: parsed.amount_ml,
    breastfeed_minutes: parsed.breastfeed_minutes,
    notes: parsed.notes
  });
});

bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});
