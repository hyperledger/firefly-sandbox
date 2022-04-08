import { styled } from '@mui/material';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';

const Main = styled('main')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'auto',
});

const RootDiv = styled('div')({
  display: 'flex',
});

export const AppWrapper: React.FC = () => {
  const { pathname } = useLocation();

  if (pathname === '/') {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <RootDiv>
      <Main>
        <Outlet />
      </Main>
    </RootDiv>
  );
};
