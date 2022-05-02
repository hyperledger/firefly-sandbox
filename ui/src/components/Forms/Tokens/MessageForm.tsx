import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TUTORIAL_FORMS } from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FormContext } from '../../../contexts/FormContext';
import { BroadcastForm } from '../Messages/BroadcastForm';
import { PrivateForm } from '../Messages/PrivateForm';

interface Props {
  tokenMissingFields: boolean;
  tokenOperationPayload: object;
  label: string;
}

export const MessageForm: React.FC<Props> = ({
  tokenMissingFields,
  tokenOperationPayload,
  label,
}) => {
  const { jsonPayload, setJsonPayload } = useContext(ApplicationContext);
  const { formID } = useContext(FormContext);
  const { t } = useTranslation();

  const [withMessage, setWithMessage] = useState<boolean>(false);
  const [messageMethod, setMessageMethod] = useState<string>(
    TUTORIAL_FORMS.BROADCAST
  );

  useEffect(() => {
    setWithMessage(false);
    setJsonPayload({ ...jsonPayload, messagingMethod: null, recipients: null });
  }, [formID]);

  return (
    <>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={withMessage}
              onChange={() => {
                if (withMessage) {
                  setJsonPayload({
                    ...tokenOperationPayload,
                    messagingMethod: null,
                  });
                }
                setWithMessage(!withMessage);
              }}
            />
          }
          label={label}
        />
      </Grid>
      {withMessage === true && (
        <>
          <Grid item width="100%">
            <FormControl fullWidth required>
              <InputLabel>{t('messagingMethod')}</InputLabel>
              <Select
                fullWidth
                value={messageMethod}
                label={t('messagingMethod')}
                onChange={(e) => {
                  setMessageMethod(e.target.value);
                  setJsonPayload({
                    ...tokenOperationPayload,
                    messagingMethod: withMessage ? e.target.value : null,
                  });
                }}
              >
                <MenuItem
                  key={'messageMethod-broadcast'}
                  value={TUTORIAL_FORMS.BROADCAST}
                >
                  {t('broadcast')}
                </MenuItem>
                <MenuItem
                  key={'messageMethod-private'}
                  value={TUTORIAL_FORMS.PRIVATE}
                >
                  {t(TUTORIAL_FORMS.PRIVATE)}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </>
      )}
      {withMessage === true && (
        <Grid container item>
          {messageMethod === TUTORIAL_FORMS.BROADCAST ? (
            <BroadcastForm
              tokenBody={{
                ...jsonPayload,
                messagingMethod: TUTORIAL_FORMS.BROADCAST,
              }}
              tokenMissingFields={tokenMissingFields}
            />
          ) : (
            <PrivateForm
              tokenBody={{
                ...jsonPayload,
                messagingMethod: TUTORIAL_FORMS.PRIVATE,
              }}
              tokenMissingFields={tokenMissingFields}
            />
          )}
        </Grid>
      )}
    </>
  );
};
