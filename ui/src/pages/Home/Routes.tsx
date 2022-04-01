import { RouteObject } from 'react-router-dom';
import { HomeDashboard } from './views/Dashboard';

export const HomeRoutes: RouteObject = {
  path: `/home`,
  element: <HomeDashboard />,
  index: true,
};
