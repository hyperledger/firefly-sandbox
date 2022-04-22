import { ArrowForwardIos } from '@mui/icons-material';
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setDumbAwaitedEventId } from '../../AppWrapper';
import { TUTORIAL_CATEGORIES } from '../../constants/TutorialSections';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { EventContext } from '../../contexts/EventContext';
import { FormContext } from '../../contexts/FormContext';
import { DEFAULT_BORDER_RADIUS } from '../../theme';
import { isSuccessfulResponse } from '../../utils/strings';

interface Props {
  endpoint: string;
  payload: any;
  disabled?: boolean;
}

export const RunButton: React.FC<Props> = ({ endpoint, payload, disabled }) => {
  const { t } = useTranslation();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { setApiStatus, setApiResponse, payloadMissingFields } =
    useContext(ApplicationContext);
  const {
    addAwaitedEventID,
    dumbAwaitedEventID,
    justSubmitted,
    setJustSubmitted,
  } = useContext(EventContext);
  const { formID, categoryID, isBlob } = useContext(FormContext);

  useEffect(() => {
    setJustSubmitted(false);
    setDumbAwaitedEventId(undefined);
  }, [formID]);

  useEffect(() => {
    setJustSubmitted(false);
  }, [dumbAwaitedEventID]);

  const handleCloseSnackbar = (_: any, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  };

  const handlePost = () => {
    setApiStatus(undefined);
    setApiResponse({});
    managePayload();
    const postEndpoint = isBlob ? endpoint + 'blob' : endpoint;
    const reqDetails: any = {
      method: 'POST',
      body: isBlob
        ? buildFormData(payload, postEndpoint)
        : JSON.stringify(payload),
    };
    if (!isBlob) {
      reqDetails.headers = { 'Content-Type': 'application/json' };
    }
    fetch(postEndpoint, reqDetails)
      .then((response) => {
        setApiStatus({
          status: response.status,
          statusText: response.statusText,
        });
        return Promise.all([response, response.json()]);
      })
      .then((result) => {
        const [response, data] = result;
        setShowSnackbar(true);
        setApiResponse(data);
        if (response.status === 202) {
          setJustSubmitted(true);
          addAwaitedEventID(data);
        } else if (!isSuccessfulResponse(response.status)) {
          setJustSubmitted(false);
          setDumbAwaitedEventId(undefined);
        }
      })
      .catch((err) => {
        setShowSnackbar(true);
        setApiResponse(err);
      });
  };

  const managePayload = () => {
    if (!isBlob) {
      delete payload['filename'];
    }
    if (categoryID === TUTORIAL_CATEGORIES.TOKENS) {
      delete payload['message'];
    }
  };

  const buildFormData = (payload: any, blobEndpoint: string) => {
    const data = new FormData();
    const file: any = document.querySelector('input[type="file"]');
    data.append('file', file.files[0]);
    data.append('tag', payload.tag);
    data.append('topic', payload.topic);
    console.log('blobob', blobEndpoint);
    if (blobEndpoint.includes('privateblob')) {
      for (const r of payload.recipients) {
        data.append('recipients[]', r);
      }
    }
    return data;
  };

  return (
    <>
      {dumbAwaitedEventID || justSubmitted ? (
        <Grid
          justifyContent="space-between"
          direction="row"
          container
          alignItems={'center'}
        >
          <Grid item xs={11}>
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
              {t('waitingForTxEventsToFinish')}
            </Typography>
          </Grid>
          <Grid item xs={1} container justifyContent="flex-end">
            <CircularProgress size={16} color="warning" />
          </Grid>
        </Grid>
      ) : (
        <>
          <Button
            endIcon={<ArrowForwardIos />}
            variant="contained"
            disabled={disabled || payloadMissingFields}
            sx={{ borderRadius: DEFAULT_BORDER_RADIUS }}
            onClick={handlePost}
            size="small"
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
              severity={'success'}
              sx={{ width: '100%' }}
              variant={'filled'}
            >
              {`${t('postSentTo')}${endpoint}`}
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
};
