import {
  Block,
  DataObject,
  FormatQuote,
  UploadFile,
} from '@mui/icons-material';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FF_Paths } from '../../constants/FF_Paths';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { POST_BODY_TYPE } from '../../enums/enums';
import { IDatatype } from '../../interfaces/api';
import { getTemplateCategory } from '../../pages/Home/views/MiddlePane';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils/fetches';

export const DEFAULT_MESSAGE_STRING = 'This is a message';
export const DEFAULT_MESSAGE_JSON = {
  name: 'This is a message',
};

interface Props {
  message: string | undefined;
  jsonValue: string | undefined;
  recipients?: string[] | undefined;
  fileName?: string;
  datatype?: IDatatype | undefined;
  onSetMessage: any;
  onSetFileName?: any;
  onSetJsonValue: any;
  onSetDatatype?: any;
  noUndefined?: boolean;
}

export const MessageTypeGroup: React.FC<Props> = ({
  noUndefined = false,
  message,
  jsonValue,
  fileName,
  datatype,
  recipients,
  onSetMessage,
  onSetFileName,
  onSetJsonValue,
  onSetDatatype,
}) => {
  const { t } = useTranslation();
  const [messageType, setMessageType] = useState<POST_BODY_TYPE>(
    POST_BODY_TYPE.STRING
  );
  const { reportFetchError } = useContext(SnackbarContext);
  const [datatypes, setDatatypes] = useState<IDatatype[]>([]);
  const { activeForm, setActiveForm, setPayloadMissingFields } =
    useContext(ApplicationContext);

  useEffect(() => {
    if (getTemplateCategory(activeForm) !== 'messages') return;
    if (activeForm.indexOf('blob') < 0) {
      if (!message && !jsonValue) {
        onSetMessage(DEFAULT_MESSAGE_STRING);
      }
      setMessageType(message ? POST_BODY_TYPE.STRING : POST_BODY_TYPE.JSON);
      setDefaultJsonDatatype();
      checkMissingFields();
    } else {
      const file: any = document.querySelector('input[type="file"]');
      setPayloadMissingFields(!file.files[0] ? true : false);
    }
  }, [activeForm, messageType]);

  useEffect(() => {
    if (getTemplateCategory(activeForm) !== 'messages') return;
    checkMissingFields();
  }, [message, jsonValue, messageType, fileName, recipients]);

  const checkMissingFields = () => {
    if (
      (activeForm.includes('private') && recipients?.length === 0) ||
      (!message && messageType === POST_BODY_TYPE.STRING) ||
      (!jsonValue && messageType === POST_BODY_TYPE.JSON) ||
      (messageType === POST_BODY_TYPE.FILE && !fileName)
    ) {
      setPayloadMissingFields(true);
    } else {
      setPayloadMissingFields(false);
    }
  };

  useEffect(() => {
    if (
      getTemplateCategory(activeForm) !== 'messages' ||
      messageType !== POST_BODY_TYPE.JSON ||
      !datatype
    )
      return;
    setDatatypeBasedJson();
  }, [datatype]);

  const setDefaultJsonDatatype = () => {
    if (messageType === POST_BODY_TYPE.JSON) {
      fetchCatcher(`${FF_Paths.datatypes}`)
        .then((dtRes: IDatatype[]) => {
          setDatatypes(dtRes);
          if (dtRes.length > 0) {
            onSetDatatype(dtRes[0]);
            setDatatypeBasedJson();
            return;
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
      if (!datatype) {
        onSetJsonValue(JSON.stringify(DEFAULT_MESSAGE_JSON, null, 2));
      }
    } else {
      onSetDatatype(undefined);
      onSetJsonValue(undefined);
    }
  };

  const setDatatypeBasedJson = () => {
    const properties = datatype?.schema?.properties;
    if (properties) {
      const keys = Object.keys(properties);
      const newJsonValue = {} as any;
      for (const k of keys) {
        const type = properties[k].type;
        newJsonValue[k] =
          type === 'string'
            ? 'string'
            : type === 'integer'
            ? 1
            : type === 'boolean'
            ? true
            : type === 'number'
            ? 50.5
            : null;
      }
      onSetJsonValue(JSON.stringify(newJsonValue));
    }
  };

  const handleMessageTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: POST_BODY_TYPE
  ) => {
    if (!newAlignment) {
      return;
    }
    setMessageType(newAlignment);
    switch (newAlignment) {
      case POST_BODY_TYPE.NONE:
        onSetMessage(undefined);
        if (activeForm.includes('blob')) {
          setActiveForm(activeForm.replace('blob', ''));
        }
        return;
      case POST_BODY_TYPE.STRING:
        checkMissingFields();
        onSetDatatype(undefined);
        onSetMessage(DEFAULT_MESSAGE_STRING);
        onSetJsonValue(undefined);
        if (activeForm.includes('blob')) {
          setActiveForm(activeForm.replace('blob', ''));
        }
        return;
      case POST_BODY_TYPE.JSON:
        onSetMessage(undefined);
        checkMissingFields();
        setDefaultJsonDatatype();
        if (activeForm.includes('blob')) {
          setActiveForm(activeForm.replace('blob', ''));
        }
        return;
      case POST_BODY_TYPE.FILE:
        onSetMessage(undefined);
        onSetJsonValue(undefined);
        onSetFileName('');
        onSetDatatype(undefined);
        setActiveForm(
          activeForm.indexOf('blob') > -1 ? activeForm : activeForm + 'blob'
        );
        return;
      default:
        onSetMessage(DEFAULT_MESSAGE_STRING);
    }
  };

  return (
    <Grid container item xs={12} justifyContent="flex-end">
      {/* Body type selector */}
      <ToggleButtonGroup
        size="small"
        value={messageType}
        exclusive
        onChange={handleMessageTypeChange}
        sx={{ paddingBottom: 1 }}
      >
        {!noUndefined && (
          <ToggleButton value={POST_BODY_TYPE.NONE}>
            <Block />
          </ToggleButton>
        )}
        <ToggleButton value={POST_BODY_TYPE.STRING}>
          <FormatQuote />
        </ToggleButton>
        <ToggleButton value={POST_BODY_TYPE.JSON}>
          <DataObject />
        </ToggleButton>
        <ToggleButton value={POST_BODY_TYPE.FILE}>
          <UploadFile />
        </ToggleButton>
      </ToggleButtonGroup>
      {/* Text input, or file upload button */}
      {
        <Grid container item xs={12} pt={1}>
          {messageType !== POST_BODY_TYPE.FILE ? (
            <>
              {messageType === POST_BODY_TYPE.JSON ? (
                <Grid
                  container
                  item
                  justifyContent="space-between"
                  spacing={1}
                  pb={DEFAULT_PADDING}
                >
                  <Grid item width="100%">
                    <FormControl
                      fullWidth
                      required
                      disabled={datatypes.length ? false : true}
                    >
                      <InputLabel>
                        {datatypes.length ? t('datatypes') : t('noDatatypes')}
                      </InputLabel>
                      <Select
                        fullWidth
                        value={datatype?.id ?? ''}
                        label={
                          datatypes.length ? t('datatypes') : t('noDatatypes')
                        }
                        onChange={(e) =>
                          onSetDatatype(
                            datatypes.find((t) => t.id === e.target.value)
                          )
                        }
                      >
                        {datatypes.map((tp, idx) => (
                          <MenuItem key={idx} value={tp.id}>
                            <Typography color="primary">
                              {tp.name}&nbsp;({tp.version})
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
              <TextField
                label={t('message')}
                multiline
                required
                fullWidth
                maxRows={7}
                value={
                  messageType === POST_BODY_TYPE.STRING
                    ? message
                    : jsonValue
                    ? jsonValue
                    : ''
                }
                onChange={(e) =>
                  messageType === POST_BODY_TYPE.STRING
                    ? onSetMessage(e.target.value)
                    : onSetJsonValue(e.target.value)
                }
              />
            </>
          ) : (
            <Button
              variant="outlined"
              component="label"
              sx={{ textTransform: 'none', padding: '16px' }}
              fullWidth
            >
              <Typography sx={{ width: '50%' }}>{t('uploadFile')}*</Typography>
              <input
                type="file"
                required
                onChange={(event: any) => {
                  setPayloadMissingFields(false);
                  onSetFileName(event?.target?.files[0]?.name);
                }}
              />
            </Button>
          )}
        </Grid>
      }
    </Grid>
  );
};
