import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { appRouterState } from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';

// import authRoutes from './modules/auth/auth.routes';

dotenv.config();

const app = express();
// const corsOptions = {
//   origin: function (origin: string | undefined, callback: Function) {
//     const allowedOrigins = [
//       'http://localhost:3000',
//       'http://localhost:3005',
//       'https://complex.ict.lviv.ua',
//       'http://91.239.235.132:3005',
//     ];
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };


const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Якщо origin не вказаний (наприклад, прямий запит Postman) або ти хочеш дозволити всім
    if (!origin) return callback(null, true);

    callback(null, true); // дозволяє будь-який origin
  },
  credentials: true, // обов'язково для cookie
};

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: [
//       'http://localhost:3000',
//       'http://localhost:3005',
//       'https://complex.ict.lviv.ua',
//     ], // адреса твого фронтенда
//     credentials: true, // дозволяє відправляти cookie
//   }),
// );
app.use(cors(corsOptions));

app.get('/', async (req: Request, res: Response) => {
  res.json({
    message: 'Tataryn Roman.Server is running',
  });
});
appRouterState(app);
export default app;
