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
import { SDK_PATHS } from '../../../constants/SDK_PATHS';
import { TUTORIAL_FORMS } from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FormContext } from '../../../contexts/FormContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { IContractApi } from '../../../interfaces/api';
import { DEFAULT_SPACING } from '../../../theme';
import { fetchCatcher } from '../../../utils/fetches';

export const RegisterContractApiListenerForm: React.FC = () => {
  const { setJsonPayload, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { formID, setFormParam, formObject, categoryID, setCategoryParam } =
    useContext(FormContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [contractApis, setContractApis] = useState<IContractApi[]>([]);
  const [contractApi, setContractApi] = useState<string>('');
  const [events, setEvents] = useState<string[]>([]);
  const [eventPath, setEventPath] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [topic, setTopic] = useState<string>('');

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.REGISTER_CONTRACT_API_LISTENER) {
      return;
    }
    if (!topic || !eventPath) setPayloadMissingFields(true);
    setPayloadMissingFields(!topic || !contractApi || !eventPath);
    setJsonPayload({
      name,
      topic,
      apiName: contractApi,
      eventPath,
    });
  }, [name, topic, contractApi, eventPath, formID]);

  useEffect(() => {
    fetchCatcher(`${SDK_PATHS.contractsApi}`)
      .then((apiRes: IContractApi[]) => {
        setContractApis(apiRes);
        if (apiRes.length > 0) {
          setContractApi(apiRes[0].name);
        }
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [formID]);

  useEffect(() => {
    fetchCatcher(`${SDK_PATHS.contractsApiByName(contractApi)}`)
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
              <InputLabel>{t('contractApi')}</InputLabel>
              <Select
                fullWidth
                value={contractApi}
                label={t('contractApi')}
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
