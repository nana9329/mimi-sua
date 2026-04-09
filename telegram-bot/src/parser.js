/**
 * Parse tiếng Việt từ message của người dùng
 * Ví dụ: "120ml", "90ml lúc 8h", "bú mẹ 15p"
 */

export function parseMessage(text) {
  const result = {
    amount_ml: null,
    breastfeed_minutes: null,
    time: getCurrentTime(),
    notes: ""
  };

  if (!text) return result;

  const lowerText = text.toLowerCase().trim();

  // Trích xuất giờ (nếu có)
  // "lúc 8h", "8:30", "8h30"
  const timeMatch = lowerText.match(/(?:lúc\s*)(\d{1,2})(?::(\d{2})|h(?:\s*(\d{2}))?)?/);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] ? parseInt(timeMatch[2]) : (timeMatch[3] ? parseInt(timeMatch[3]) : 0);
    result.time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  // Trích xuất lượng ml
  // "120ml", "120 ml", "120"
  const mlMatch = text.match(/(\d+)\s*(?:ml|mL)/i);
  if (mlMatch) {
    result.amount_ml = parseInt(mlMatch[1]);
  }

  // Trích xuất bú mẹ (phút)
  // "bú mẹ 15p", "15 phút bú mẹ", "bú 15p"
  const breastMatch = lowerText.match(/(?:bú\s*(?:mẹ)?\s*)?(\d+)\s*(?:p|phút)\s*(?:bú\s*mẹ)?/);
  if (breastMatch) {
    result.breastfeed_minutes = parseInt(breastMatch[1]);
  }

  // Trích xuất ghi chú
  // "nôn trớ", "ngủ quên", "còn thừa"
  if (lowerText.includes("nôn trớ") || lowerText.includes("nôn")) {
    result.notes = "nôn trớ";
  } else if (lowerText.includes("ngủ quên") || lowerText.includes("ngủ")) {
    result.notes = "ngủ quên";
  } else if (lowerText.includes("thừa") || lowerText.includes("còn")) {
    result.notes = "còn thừa";
  }

  return result;
}

export function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Validate dữ liệu parsed
 */
export function isValidFeeding(parsed) {
  return (parsed.amount_ml && parsed.amount_ml > 0) || 
         (parsed.breastfeed_minutes && parsed.breastfeed_minutes > 0);
}

/**
 * Format thông tin feeding để hiển thị
 */
export function formatFeedingMessage(parsed, total) {
  let message = "✅ Đã ghi nhận:\n";

  if (parsed.amount_ml) {
    message += `🍼 ${parsed.amount_ml}ml`;
  }
  if (parsed.breastfeed_minutes) {
    message += `${parsed.amount_ml ? ' + ' : ''}🤱 ${parsed.breastfeed_minutes}p`;
  }
  if (parsed.notes) {
    message += ` (${parsed.notes})`;
  }

  message += `\n\n📊 Tổng hôm nay: ${total}ml / 800ml`;

  const percentage = Math.round((total / 800) * 100);
  message += `\n📈 ${percentage}%`;

  if (percentage >= 100) {
    message += " ✨ Tuyệt vời!";
  }

  return message;
}
