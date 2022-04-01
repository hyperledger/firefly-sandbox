import { Box } from '@mui/material';
import { styled } from '@mui/material';
import React from 'react';
import { ReactComponent as LogoSVGLight } from '../../assets/HyperledgerFireFly-Logo-Light.svg';

export const MenuLogo: React.FC = () => {
  const StyledLogo = styled(LogoSVGLight)({
    width: 125,
  });
  return (
    <Box
      sx={{
        textAlign: 'center',
      }}
    >
      <StyledLogo />
    </Box>
  );
};
