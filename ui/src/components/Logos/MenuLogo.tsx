import { Box } from '@mui/material';
import { styled } from '@mui/material';
import React from 'react';
import LogoSVGLight from '../../assets/firefly-sandbox-logo.svg';

export const MenuLogo: React.FC = () => {
  const StyledLogo = styled('img')({
    width: 220,
    paddingTop: '5px',
  });
  return (
    <Box
      sx={{
        textAlign: 'center',
      }}
    >
      <StyledLogo src={LogoSVGLight} />
    </Box>
  );
};
