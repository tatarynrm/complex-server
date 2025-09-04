// jobs/updateCurrencyJob.ts
import cron from 'node-cron';
import { updateCurrencyRates } from './currencies';


export  async function startCronJob() {
  // Запуск щодня о 09:00 ранку
//   cron.schedule('*/10 * * * *', async () => {
//     console.log('🔄 Running currency rate update job...');
    await updateCurrencyRates();
//   });
}