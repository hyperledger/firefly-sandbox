import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, RouteObject, useRoutes } from 'react-router-dom';
import { AppWrapper } from '../AppWrapper';
import { HomeRoutes } from '../pages/Home/Routes';
import { Header } from './Header';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const FF_Router: () => JSX.Element = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default function Routes() {
  const routes = useRoutes([
    {
      path: '/',
      element: <AppWrapper />,
      children: getAllRoutes(),
    },
  ]);
  return routes;
}

export function getAllRoutes(): RouteObject[] {
  return [HomeRoutes];
}
