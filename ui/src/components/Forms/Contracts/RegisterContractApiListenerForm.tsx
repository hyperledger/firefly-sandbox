import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FF_Paths } from '../../../constants/FF_Paths';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { DEFAULT_SPACING } from '../../../theme';
import { fetchCatcher } from '../../../utils/fetches';
import { TUTORIALS } from '../../../constants/TutorialSections';
import { IContractApi } from '../../../interfaces/api';

export const RegisterContractApiListenerForm: React.FC = () => {
  const { setJsonPayload, activeForm } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [contractApis, setContractApis] = useState<IContractApi[]>([]);
  const [contractApi, setContractApi] = useState<string>('');
  const [events, setEvents] = useState<string[]>([]);
  const [eventPath, setEventPath] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [topic, setTopic] = useState<string>('');

  useEffect(() => {
    if (activeForm !== TUTORIALS.REGISTER_CONTRACT_API_LISTENER) {
      return;
    }
    setJsonPayload({
      name,
      topic,
      apiName: contractApi,
      eventPath,
    });
  }, [name, topic, contractApi, eventPath, activeForm]);

  useEffect(() => {
    fetchCatcher(`${FF_Paths.api}`)
      .then((apiRes: IContractApi[]) => {
        setContractApis(apiRes);
        if (apiRes.length > 0) {
          setContractApi(apiRes[0].name);
        }
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [activeForm]);

  useEffect(() => {
    fetchCatcher(`${FF_Paths.api}/${contractApi}`)
      .then((apiRes: IContractApi) => {
        if (apiRes?.events) {
          const eventNames = apiRes.events.map((e: any) => e.pathname);
          setEvents(eventNames);
          if (eventNames.length > 0) {
            setEventPath(eventNames[0]);
          }
        }
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [contractApi]);
  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        <Grid container item justifyContent="space-between" spacing={1}>
          <Grid item width="100%">
            <FormControl
              fullWidth
              required
              disabled={contractApis.length ? false : true}
            >
              <InputLabel>{t('contractInterface')}</InputLabel>
              <Select
                fullWidth
                value={contractApi}
                label={t('contractInterface')}
                onChange={(e) => {
                  setContractApi(e.target.value);
                }}
              >
                {contractApis.map((tp, idx) => (
                  <MenuItem key={idx} value={tp.name}>
                    <Typography>{tp.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container item justifyContent="space-between" spacing={1}>
          <Grid item width="100%">
            <FormControl fullWidth required disabled={events.length === 0}>
              <InputLabel>{t('events')}</InputLabel>
              <Select
                fullWidth
                value={eventPath}
                label={t('events')}
                onChange={(e) => {
                  setEventPath(e.target.value);
                }}
              >
                {events.map((ev, idx) => (
                  <MenuItem key={idx} value={ev}>
                    <Typography>{ev}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <TextField
              fullWidth
              label={t('name')}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <TextField
              fullWidth
              required
              label={t('topic')}
              onChange={(e) => setTopic(e.target.value)}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};
