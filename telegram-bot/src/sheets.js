import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const sheets = google.sheets('v4');

/**
 * Khởi tạo Google Sheets client
 * Yêu cầu: GOOGLE_SHEETS_ID, GOOGLE_API_KEY trong .env
 */
export class GoogleSheetsDB {
  constructor(apiKey, spreadsheetId) {
    this.apiKey = apiKey;
    this.spreadsheetId = spreadsheetId;
  }

  /**
   * Thêm bản ghi feeding vào Google Sheets
   */
  async addFeeding(date, time, amount_ml, breastfeed_minutes, notes) {
    try {
      const request = {
        spreadsheetId: this.spreadsheetId,
        range: 'Feedings!A1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[date, time, amount_ml || '', breastfeed_minutes || '', notes || '']]
        },
        key: this.apiKey
      };

      await sheets.spreadsheets.values.append(request);
      return true;
    } catch (error) {
      console.error('❌ Lỗi thêm vào Google Sheets:', error);
      return false;
    }
  }

  /**
   * Lấy tất cả feedings hôm nay
   */
  async getTodayFeedings(date) {
    try {
      const request = {
        spreadsheetId: this.spreadsheetId,
        range: 'Feedings!A:E',
        key: this.apiKey
      };

      const response = await sheets.spreadsheets.values.get(request);
      const rows = response.data.values || [];

      // Lọc bản ghi hôm nay
      const today = rows.filter(row => row[0] === date);
      return today;
    } catch (error) {
      console.error('❌ Lỗi lấy dữ liệu:', error);
      return [];
    }
  }

  /**
   * Tính tổng ml hôm nay
   */
  async getTodayTotal(date) {
    const feedings = await this.getTodayFeedings(date);
    let total = 0;

    for (const row of feedings) {
      const ml = parseInt(row[2]) || 0;
      const breastfeedMinutes = parseInt(row[3]) || 0;
      
      // Quy đổi: 1 phút bú ≈ 10ml (tùy chỉnh được)
      const breastfeedMl = breastfeedMinutes * 10;
      total += ml + breastfeedMl;
    }

    return total;
  }
}

/**
 * Local fallback database (lưu vào JSON)
 * Dùng nếu không có Google Sheets API
 */
export class LocalDB {
  constructor() {
    this.dbPath = './data/feedings.json';
    this.ensureDbExists();
  }

  ensureDbExists() {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify([]));
    }
  }

  addFeeding(date, time, amount_ml, breastfeed_minutes, notes) {
    const data = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
    data.push({
      date,
      time,
      amount_ml: amount_ml || 0,
      breastfeed_minutes: breastfeed_minutes || 0,
      notes: notes || ''
    });
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    return true;
  }

  getTodayFeedings(date) {
    const data = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
    return data.filter(item => item.date === date);
  }

  getTodayTotal(date) {
    const feedings = this.getTodayFeedings(date);
    return feedings.reduce((sum, f) => {
      const breastfeedMl = (f.breastfeed_minutes || 0) * 10;
      return sum + (f.amount_ml || 0) + breastfeedMl;
    }, 0);
  }
}
