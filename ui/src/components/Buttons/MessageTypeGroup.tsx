import {
  Block,
  DataObject,
  FormatQuote,
  UploadFile,
} from '@mui/icons-material';
import {
  Button,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JsonPayloadContext } from '../../contexts/JsonPayloadContext';

export const DEFAULT_MESSAGE_STRING = 'This is a message';
const DEFAULT_MESSAGE_JSON = {
  name: 'This is a message',
};

interface Props {
  message: string | object | undefined;
  onSetMessage: any;
  onSetFileName?: any;
  noUndefined?: boolean;
}

export const MessageTypeGroup: React.FC<Props> = ({
  noUndefined = false,
  message,
  onSetMessage,
  onSetFileName,
}) => {
  const { t } = useTranslation();
  const [messageType, setMessageType] = useState<
    'none' | 'string' | 'json' | 'file'
  >('string');
  const { activeForm, setActiveForm } = useContext(JsonPayloadContext);

  const handleMessageTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: 'none' | 'string' | 'json' | 'file'
  ) => {
    setMessageType(newAlignment);
    switch (newAlignment) {
      case 'none':
        onSetMessage(undefined);
        setActiveForm(activeForm.replace('blob', ''));
        return;
      case 'string':
        onSetMessage(DEFAULT_MESSAGE_STRING);
        setActiveForm(activeForm.replace('blob', ''));
        return;
      case 'json':
        onSetMessage(DEFAULT_MESSAGE_JSON);
        return;
      case 'file':
        onSetMessage('');
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
      <ToggleButtonGroup
        size="small"
        value={messageType}
        exclusive
        onChange={handleMessageTypeChange}
        sx={{ paddingBottom: 1 }}
      >
        {!noUndefined && (
          <ToggleButton value="none">
            <Block />
          </ToggleButton>
        )}
        <ToggleButton value="string">
          <FormatQuote />
        </ToggleButton>
        <ToggleButton disabled value="json">
          <DataObject />
        </ToggleButton>
        <ToggleButton value="file">
          <UploadFile />
        </ToggleButton>
      </ToggleButtonGroup>
      {
        <Grid container item xs={12} pt={1}>
          {messageType !== 'file' ? (
            <TextField
              label={t('message')}
              multiline
              required
              fullWidth
              maxRows={7}
              value={
                messageType === 'json'
                  ? JSON.stringify(message, null, 2)
                  : messageType === 'string'
                  ? message
                  : ''
              }
              onChange={(e) =>
                onSetMessage(
                  messageType === 'string'
                    ? e.target.value
                    : messageType === undefined
                    ? undefined
                    : JSON.parse(e.target.value)
                )
              }
            />
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
                onChange={(event: any) =>
                  onSetFileName(event?.target?.files[0]?.name)
                }
              />
            </Button>
          )}
        </Grid>
      }
    </Grid>
  );
};
