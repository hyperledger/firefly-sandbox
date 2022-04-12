import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AppWrapper } from '../AppWrapper';
import { HomeRoutes } from '../pages/Home/Routes';

export const FF_Router: () => JSX.Element = () => {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

export default function Routes() {
  const routes = useRoutes([
    {
      path: '/',
      element: <AppWrapper />,
      children: [HomeRoutes],
    },
  ]);
  return routes;
}
