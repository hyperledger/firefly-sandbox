import {
  Block,
  DataObject,
  FormatQuote,
  UploadFile,
} from '@mui/icons-material';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MAX_FORM_ROWS } from '../../App';
import { SDK_PATHS } from '../../constants/SDK_PATHS';
import {
  TUTORIAL_CATEGORIES,
  TUTORIAL_FORMS,
} from '../../constants/TutorialSections';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FormContext } from '../../contexts/FormContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { POST_BODY_TYPE } from '../../enums/enums';
import { IDatatype } from '../../interfaces/api';
import { altScrollbarStyle, DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils/fetches';
import { isTokenMessage } from '../../utils/strings';

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
  tokenMissingFields?: boolean;
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
  tokenMissingFields,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [messageType, setMessageType] = useState<POST_BODY_TYPE>(
    POST_BODY_TYPE.STRING,
  );
  const { formID, categoryID, isBlob, setIsBlob } = useContext(FormContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [datatypes, setDatatypes] = useState<IDatatype[]>([]);
  const [withDatatype, setWithDatatype] = useState<boolean>(true);
  const { jsonPayload, setPayloadMissingFields } =
    useContext(ApplicationContext);

  useEffect(() => {
    if (categoryID !== TUTORIAL_CATEGORIES.MESSAGES && !isTokenMessage(formID))
      return;
    checkMissingFields();
  }, [
    formID,
    message,
    jsonValue,
    messageType,
    fileName,
    recipients,
    tokenMissingFields,
  ]);

  useEffect(() => {
    if (categoryID !== TUTORIAL_CATEGORIES.MESSAGES && !isTokenMessage(formID))
      return;
    if (!isBlob) {
      if (
        (!message && !jsonValue) ||
        (isTokenMessage(formID) && !(jsonPayload as any).message)
      ) {
        onSetMessage(DEFAULT_MESSAGE_STRING);
      }
      const bodyType = message ? POST_BODY_TYPE.STRING : POST_BODY_TYPE.JSON;
      setMessageType(bodyType);
      if (bodyType === POST_BODY_TYPE.JSON) {
        setDefaultJsonDatatype();
      } else {
        onSetDatatype(undefined);
        onSetJsonValue(undefined);
      }
    }
    checkMissingFields();
  }, [formID, messageType]);

  useEffect(() => {
    if (messageType !== POST_BODY_TYPE.JSON) return;
    if (!withDatatype) {
      onSetDatatype(undefined);
      onSetJsonValue(undefined);
    }
    setDefaultJsonDatatype();
  }, [withDatatype]);

  const checkMissingFields = () => {
    if (isBlob) {
      const file: any = document.querySelector('input[type="file"]');
      setPayloadMissingFields(
        !file?.files[0] ||
          (!isTokenMessage(formID) &&
            messageType === POST_BODY_TYPE.FILE &&
            !fileName) ||
          tokenMissingFields
          ? true
          : false,
      );
    } else {
      if (
        (formID === TUTORIAL_FORMS.PRIVATE && recipients?.length === 0) ||
        (!message && messageType === POST_BODY_TYPE.STRING) ||
        (!jsonValue && messageType === POST_BODY_TYPE.JSON) ||
        tokenMissingFields
      ) {
        setPayloadMissingFields(true);
      } else {
        setPayloadMissingFields(false);
      }
    }
  };

  useEffect(() => {
    if (
      formID === null ||
      (categoryID !== TUTORIAL_CATEGORIES.MESSAGES &&
        !isTokenMessage(formID)) ||
      messageType !== POST_BODY_TYPE.JSON ||
      !datatype
    )
      return;
    setDatatypeBasedJson(datatype);
  }, [datatype, formID]);

  const setDefaultJsonDatatype = () => {
    if (withDatatype) {
      fetchCatcher(`${SDK_PATHS.messagesDatatypes}`)
        .then((dtRes: IDatatype[]) => {
          setDatatypes(dtRes);
          if (dtRes.length > 0) {
            onSetDatatype(dtRes[0]);
            setDatatypeBasedJson(dtRes[0]);
            return;
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
    if (!datatype || !withDatatype) {
      onSetJsonValue(JSON.stringify(DEFAULT_MESSAGE_JSON, null, 2));
    }
  };

  const setDatatypeBasedJson = (dt: IDatatype) => {
    const properties = dt.schema?.properties;
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
    messageType: POST_BODY_TYPE,
  ) => {
    if (!messageType) {
      return;
    }
    setMessageType(messageType);
    switch (messageType) {
      case POST_BODY_TYPE.NONE:
        setIsBlob(false);
        onSetMessage(undefined);
        return;
      case POST_BODY_TYPE.STRING:
        setIsBlob(false);
        onSetDatatype(undefined);
        onSetMessage(DEFAULT_MESSAGE_STRING);
        checkMissingFields();
        onSetJsonValue(undefined);
        return;
      case POST_BODY_TYPE.JSON:
        setIsBlob(false);
        onSetMessage(undefined);
        checkMissingFields();
        setDefaultJsonDatatype();
        return;
      case POST_BODY_TYPE.FILE:
        setIsBlob(true);
        onSetMessage(undefined);
        onSetJsonValue(undefined);
        onSetFileName('');
        onSetDatatype(undefined);
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
      {
        <Grid container item xs={12}>
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
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={withDatatype}
                          onChange={() => {
                            setWithDatatype(!withDatatype);
                          }}
                        />
                      }
                      label={t('specifyDatatype')}
                    />
                  </Grid>
                  {withDatatype && (
                    <Grid item width="100%">
                      <FormControl
                        fullWidth
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
                              datatypes.find((t) => t.id === e.target.value),
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
                  )}
                </Grid>
              ) : (
                <></>
              )}
              <TextField
                label={t('message')}
                multiline
                required
                fullWidth
                maxRows={MAX_FORM_ROWS}
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
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  ...altScrollbarStyle,
                }}
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
                  const file = event?.target?.files[0]?.name;
                  onSetFileName(file);
                  setPayloadMissingFields(
                    (tokenMissingFields || !file) ?? false,
                  );
                }}
              />
            </Button>
          )}
        </Grid>
      }
    </Grid>
  );
};
