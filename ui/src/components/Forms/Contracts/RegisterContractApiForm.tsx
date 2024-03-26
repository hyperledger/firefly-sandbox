import {
  Checkbox,
  FormControl,
  FormControlLabel,
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
import { BLOCKCHAIN_TYPE } from '../../../enums/enums';
import { IContractInterface } from '../../../interfaces/api';
import { DEFAULT_SPACING } from '../../../theme';
import { fetchCatcher } from '../../../utils/fetches';
import { isValidFFName, isValidAddress } from '../../../utils/regex';

export const RegisterContractApiForm: React.FC = () => {
  const {
    blockchainPlugin,
    multiparty,
    setJsonPayload,
    setPayloadMissingFields,
  } = useContext(ApplicationContext);
  const { formID } = useContext(FormContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [contractInterfaces, setContractInterfaces] = useState<
    IContractInterface[]
  >([]);
  const [contractInterfaceIdx, setContractInterfaceIdx] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [publish, setPublish] = useState<boolean>(true);
  const [nameError, setNameError] = useState<string>('');
  const [chaincode, setChaincode] = useState<string>('');
  const [channel, setChannel] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [contractAddressError, setContractAddressError] = useState<string>('');

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
    if (blockchainPlugin === BLOCKCHAIN_TYPE.FABRIC) {
      setPayloadMissingFields(!name || !chaincode || !channel);
    } else {
      setPayloadMissingFields(!name || !contractAddress);
    }

    if (blockchainPlugin !== BLOCKCHAIN_TYPE.FABRIC) {
      setJsonPayload({
        name,
        interfaceName: contractInterfaces[contractInterfaceIdx]?.name || '',
        interfaceVersion:
          contractInterfaces[contractInterfaceIdx]?.version || '',
        address: contractAddress,
        publish: multiparty ? publish : undefined,
      });
    } else {
      setJsonPayload({
        name,
        interfaceName: contractInterfaces[contractInterfaceIdx]?.name || '',
        interfaceVersion:
          contractInterfaces[contractInterfaceIdx]?.version || '',
        chaincode: chaincode,
        channel: channel,
        address: '',
        publish: multiparty ? publish : undefined,
      });
    }
  }, [
    name,
    chaincode,
    channel,
    contractInterfaceIdx,
    contractAddress,
    formID,
    blockchainPlugin,
    multiparty,
    publish,
  ]);

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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;
                if (newValue === '') {
                  setNameError(t(''));
                } else if (!isValidFFName(newValue)) {
                  setNameError(
                    t('form.validation.invalidFFField', {
                      field: t('form.contracts.apiEndpointName'),
                    }),
                  );
                } else {
                  setNameError('');
                }
                setName(newValue);
              }}
              error={!!nameError}
              helperText={nameError}
            />
          </FormControl>
        </Grid>
        {blockchainPlugin !== BLOCKCHAIN_TYPE.FABRIC ? (
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <TextField
                fullWidth
                required
                label={t('address')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = event.target.value;
                  if (newValue === '') {
                    setContractAddressError(t(''));
                  } else if (!isValidAddress(newValue)) {
                    setContractAddressError(
                      t('form.validation.invalidAddress'),
                    );
                  } else {
                    setContractAddressError('');
                  }
                  setContractAddress(newValue);
                }}
                error={!!contractAddressError}
                helperText={contractAddressError}
              />
              <FormHelperText id="address-helper-text">
                {t('contractAddressHelperText')}
              </FormHelperText>
            </FormControl>
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <TextField
                  fullWidth
                  required
                  label={t('chaincode')}
                  onChange={(e) => setChaincode(e.target.value)}
                />
                <FormHelperText>{t('chaincodeHelperText')}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <TextField
                  fullWidth
                  required
                  label={t('channel')}
                  onChange={(e) => setChannel(e.target.value)}
                />
                <FormHelperText>{t('channelHelperText')}</FormHelperText>
              </FormControl>
            </Grid>
          </>
        )}
        {/* Publish */}
        {multiparty && (
          <Grid container item justifyContent="space-between" spacing={1}>
            <Grid item xs={12}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={publish}
                      onChange={() => {
                        setPublish(!publish);
                      }}
                    />
                  }
                  label={t('publishToNetwork')}
                />
                <FormHelperText>
                  {t('publishContractAPIHelperText')}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
