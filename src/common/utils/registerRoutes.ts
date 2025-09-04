import { Express, Router } from 'express';

type RouteConfig = {
  path: string;
  router: Router;
};

export default function registerRoutes(app: Express, routes: RouteConfig[]) {
  routes.map(({ path, router }) => app.use(path, router));
}
