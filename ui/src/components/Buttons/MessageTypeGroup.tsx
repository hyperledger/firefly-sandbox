import {
  Block,
  DataObject,
  FormatQuote,
  UploadFile,
} from '@mui/icons-material';
import {
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const DEFAULT_MESSAGE_STRING = 'This is a message';
const DEFAULT_MESSAGE_JSON = {
  name: 'This is a message',
};

interface Props {
  message: string | object | undefined;
  onSetMessage: any;
  noUndefined?: boolean;
}

export const MessageTypeGroup: React.FC<Props> = ({
  noUndefined = false,
  message,
  onSetMessage,
}) => {
  const { t } = useTranslation();
  const [messageType, setMessageType] = useState<
    'none' | 'string' | 'json' | 'file'
  >('string');

  const handleMessageTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: 'none' | 'string' | 'json' | 'file'
  ) => {
    setMessageType(newAlignment);
    switch (newAlignment) {
      case 'none':
        onSetMessage(undefined);
        return;
      case 'string':
        onSetMessage(DEFAULT_MESSAGE_STRING);
        return;
      case 'json':
        onSetMessage(DEFAULT_MESSAGE_JSON);
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
        <ToggleButton value="json">
          <DataObject />
        </ToggleButton>
        <ToggleButton disabled value="file">
          <UploadFile />
        </ToggleButton>
      </ToggleButtonGroup>
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
    </Grid>
  );
};
