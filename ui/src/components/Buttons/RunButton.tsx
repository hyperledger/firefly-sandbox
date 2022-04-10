import { ArrowForwardIos } from '@mui/icons-material';
import { Alert, Button, Snackbar, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JsonPayloadContext } from '../../contexts/JsonPayloadContext';
import { DEFAULT_BORDER_RADIUS } from '../../theme';

interface Props {
  endpoint: string;
  payload: any;
  disabled?: boolean;
}

export const RunButton: React.FC<Props> = ({ endpoint, payload, disabled }) => {
  const { t } = useTranslation();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { activeForm, setApiResponse } = useContext(JsonPayloadContext);

  const handleCloseSnackbar = (_: any, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackbar(false);
  };

  const handlePost = () => {
    const blobUpload = activeForm.includes('blob');
    managePayload();
    const reqDetails: any = {
      method: 'POST',
      body: blobUpload
        ? buildFormData(payload, endpoint)
        : JSON.stringify(payload),
    };
    if (!blobUpload) {
      reqDetails.headers = { 'Content-Type': 'application/json' };
    }
    fetch(endpoint, reqDetails)
      .then((response) => response.json())
      .then((data) => {
        setShowSnackbar(true);
        setApiResponse(data);
      })
      .catch((err) => {
        setShowSnackbar(true);
        setApiResponse(err);
      });
  };

  const managePayload = () => {
    const blobUpload = activeForm.includes('blob');
    if (!blobUpload) {
      delete payload['filename'];
    }
    const tokenOperations = ['mint', 'burn', 'transfer'];
    if (tokenOperations.includes(activeForm)) {
      delete payload['message'];
    }
  };

  const buildFormData = (payload: any, blobEndpoint: string) => {
    const data = new FormData();
    const file: any = document.querySelector('input[type="file"]');
    data.append('file', file.files[0]);
    data.append('tag', payload.tag);
    data.append('topic', payload.topic);
    if (blobEndpoint.includes('privateblob')) {
      for (const r of payload.recipients) {
        data.append('recipients[]', r);
      }
    }
    return data;
  };

  return (
    <>
      <Button
        endIcon={<ArrowForwardIos />}
        variant="contained"
        disabled={disabled}
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
