import { ArrowForwardIos } from '@mui/icons-material';
import { Alert, Button, Snackbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_BORDER_RADIUS } from '../../theme';

interface Props {
  endpoint: string;
  payload: object;
}

export const RunButton: React.FC<Props> = ({ endpoint, payload }) => {
  const { t } = useTranslation();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleCloseSnackbar = (_: any, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackbar(false);
  };

  const handlePost = () => {
    fetch(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
      .then((response) => response.json())
      .then(() => {
        setShowSnackbar(true);
      })
      .catch(() => {
        setShowSnackbar(true);
      });
  };

  return (
    <>
      <Button
        endIcon={<ArrowForwardIos />}
        variant="contained"
        sx={{ borderRadius: DEFAULT_BORDER_RADIUS }}
        onClick={handlePost}
      >
        <Typography>{t('run')}</Typography>
      </Button>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={'info'}
          sx={{ width: '100%' }}
        >
          {`POST Sent to ${endpoint}`}
        </Alert>
      </Snackbar>
    </>
  );
};
