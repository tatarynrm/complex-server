import { Request, Response } from 'express';
import { smsService } from './sms.service';

class SmsController {
  async sendMessages(req: Request, res: Response) {
    const result = await smsService.sendMessages(req.body);
    res.json(result);
  }

 async getLogs(req: Request, res: Response) {
    console.log(req.query);
    
    try {
      const { startDate, endDate, phone } = req.query;

      // якщо фільтрів нема → повертаємо поточний місяць
      if (!startDate && !endDate && !phone) {
        const logs = await smsService.getCurrentMonthLogs();
        return res.json({ success: true, data: logs });
      }

      // якщо є фільтри
      const logs = await smsService.getLogs({
        startDate: startDate as string,
        endDate: endDate as string,

      });

      return res.json({ success: true, data: logs });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

}

export const smsController = new SmsController();
