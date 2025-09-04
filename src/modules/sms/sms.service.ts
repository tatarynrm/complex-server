import axios from 'axios';
import { getVodafoneToken } from '../../helpers/vodafone-token.service';
import { db } from '../../config/db';

interface IDataToSend {
  numbers: { value: string; label: string }[];
  text: string;
}
interface IFilters {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}
export class SmsService {
  async sendMessages(data: IDataToSend) {
    const numbers = data.numbers.map((item) => item.value);

    try {
      const accessToken = await getVodafoneToken();

      if (accessToken && data) {
        const url =
          'https://a2p.vodafone.ua/communication-event/api/communicationManagement/v3/communicationMessage/send';

        const headers = {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `bearer ${accessToken}`,
        };

        const dataToSend = {
          receiver: numbers,
          cascades: [
            {
              transport: 'SMS',
              senderId: 6888079,
              validityPeriod: '1',
              messageObject: {
                type: 'SMS',
                smsMessage: {
                  content: data.text,
                },
              },
            },
          ],
        };

        const sendSms = await axios.post(url, dataToSend, { headers });

        const cost = 0.92;
        for (const phone of data.numbers) {
          await db.query(
            `INSERT INTO parking_sms_logs (phone, message, cost, full_info) VALUES ($1, $2, $3, $4)`,
            [phone.value, data.text, cost, phone.label],
          );
        }

        // ✅ повертаємо результат
        return {
          success: true,
          sent: numbers.length,
          totalCost: (numbers.length * cost).toFixed(2),
          vodafoneResponse: sendSms.data,
        };
      }

      return { success: false, message: 'Access token not found' };
    } catch (error: any) {
      console.error('SMS sending failed:', error);
      return { success: false, message: error.message || 'SMS sending failed' };
    }
  }

  async getLogs(filters: IFilters = {}) {
    let query = `SELECT id, phone, message, sent_at, cost, full_info 
                 FROM parking_sms_logs WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    // якщо є фільтр по даті
    if (filters.startDate) {
      query += ` AND sent_at >= $${paramIndex++}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND sent_at <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    query += ` ORDER BY sent_at DESC`;

    const result = await db.query(query, params);
    return result.rows;
  }

  async getCurrentMonthLogs() {
    const result = await db.query(
      `SELECT id, phone, message, sent_at, cost, full_info
FROM parking_sms_logs
WHERE EXTRACT(MONTH FROM sent_at) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM sent_at) = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY sent_at DESC;`,
    );
    return result.rows;
  }
}

export const smsService = new SmsService();
