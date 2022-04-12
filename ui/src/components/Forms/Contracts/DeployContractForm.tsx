import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DEFAULT_SPACING } from '../../../theme';

export const DeployContractForm: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Grid container>
      <Grid container spacing={DEFAULT_SPACING}>
        <Grid container item justifyContent="space-between" spacing={1}></Grid>
        {/* Message */}
        {/* <MessageTypeGroup
            message={message}
            onSetMessage={(msg: string) => setMessage(msg)}
          /> */}
      </Grid>
    </Grid>
  );
};
