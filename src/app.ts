import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { appRouterState } from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';


// import authRoutes from './modules/auth/auth.routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
      origin: ['http://localhost:3000','http://localhost:3005'], // адреса твого фронтенда
    credentials: true, // дозволяє відправляти cookie
  }),
);



appRouterState(app);
export default app;
