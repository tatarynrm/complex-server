import { Application } from 'express';
import authRoutes from '../modules/auth/auth.route';
import driversRoutes from '../modules/driver/drivers.route';
import transportationsRoutes from '../modules/transportation/transportation.route';
import trucksRoutes from '../modules/truck/truck.route';
import usersRoutes from '../modules/user/user.route';
import parkingRoutes from '../modules/parking/parking.route';
import convoysRoutes from '../modules/convoy/convoy.route';
import smsRoutes from '../modules/sms/sms.route';
const serverRoutes = [
  { path: '/auth', name: authRoutes },
  { path: '/sms', name: smsRoutes },
  { path: '/drivers', name: driversRoutes },
  { path: '/transportations', name: transportationsRoutes },
  { path: '/trucks', name: trucksRoutes },
  { path: '/users', name: usersRoutes },
  { path: '/parking', name: parkingRoutes },
  { path: '/convoys', name: convoysRoutes },
];

export const appRouterState = (app: Application) => {
  serverRoutes.forEach((route) => {
    app.use(route.path, route.name);
  });
};
