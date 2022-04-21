import {
  FormControl,
  FormHelperText,
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
import { IContractInterface } from '../../../interfaces/api';
import { DEFAULT_SPACING } from '../../../theme';
import { fetchCatcher } from '../../../utils/fetches';

export const RegisterContractApiForm: React.FC = () => {
  const { setJsonPayload, setPayloadMissingFields } =
    useContext(ApplicationContext);
  const { formID } = useContext(FormContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [contractInterfaces, setContractInterfaces] = useState<
    IContractInterface[]
  >([]);
  const [contractInterfaceIdx, setContractInterfaceIdx] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (formID !== TUTORIAL_FORMS.REGISTER_CONTRACT_API) {
      return;
    }
    setPayloadMissingFields(!name || !contractAddress);
    setJsonPayload({
      name,
      interfaceName: contractInterfaces[contractInterfaceIdx]?.name || '',
      interfaceVersion: contractInterfaces[contractInterfaceIdx]?.version || '',
      address: contractAddress,
    });
  }, [name, contractInterfaceIdx, contractAddress, formID]);

  useEffect(() => {
    isMounted &&
      fetchCatcher(`${SDK_PATHS.contractsInterface}`)
        .then((interfacesRes: IContractInterface[]) => {
          if (isMounted) {
            setContractInterfaces(interfacesRes);
            if (interfacesRes.length > 0) {
              setContractInterfaceIdx(0);
            }
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [formID, isMounted]);

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        <Grid container item justifyContent="space-between" spacing={1}>
          <Grid item width="100%">
            <FormControl
              fullWidth
              required
              disabled={contractInterfaces.length ? false : true}
            >
              <InputLabel>{t('contractInterface')}</InputLabel>
              <Select
                fullWidth
                value={contractInterfaceIdx ?? ''}
                label={t('contractInterface')}
                onChange={(e) => {
                  setContractInterfaceIdx(e.target.value as number);
                }}
              >
                {contractInterfaces.map((tp, idx) => (
                  <MenuItem key={idx} value={idx}>
                    <Typography>{`${tp.name} - ${tp.version}`}</Typography>
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
              required
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
              label={t('address')}
              onChange={(e) => setContractAddress(e.target.value)}
            />
            <FormHelperText id="address-helper-text">
              {t('contractAddressHelperText')}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};
