import axios, { AxiosError } from 'axios';
import { db } from '../../config/db';

export const updateCurrencyRates = async () => {
  try {
    const response = await axios.get(
      'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5'
    );

    const rates = response.data;

    const usd = rates.find((r: any) => r.ccy === 'USD' && r.base_ccy === 'UAH');
    const eur = rates.find((r: any) => r.ccy === 'EUR' && r.base_ccy === 'UAH');

    if (!usd || !eur) {
      throw new Error('USD or EUR rate not found in PrivatBank response');
    }

    const usd_to_uah = parseFloat(usd.sale); // беремо "sale" курс
    const eur_to_uah = parseFloat(eur.sale);

    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    await db.query(
      `
      INSERT INTO currency_rates (date, usd_to_uah, eur_to_uah)
      VALUES ($1, $2, $3)
      ON CONFLICT (date) DO NOTHING;
      `,
      [date, usd_to_uah, eur_to_uah]
    );

    console.log(`✔ Currency rates updated for ${date}`);
  } catch (err) {
    const error = err as AxiosError;
    console.error(
      '❌ Failed to update currency rates:',
      error?.response?.data || error.message
    );
  }
};