import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_BORDER_RADIUS, DEFAULT_SPACING, FFColors } from '../../theme';
import * as React from 'react';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ArrowForwardIos } from '@mui/icons-material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'blockchain_event_received',
  'message_confirmed',
  'message_rejected',
  'transaction_submitted',
  'token_pool_confirmed',
  'token_approval_confirmed',
  'token_approval_op_failed',
  'token_transfer_confirmed',
  'token_transfer_op_failed',
];

function getStyles(
  name: string,
  selectedSubscriptions: readonly string[],
  theme: Theme
) {
  return {
    fontWeight:
      selectedSubscriptions.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const EventSubscriptionForm: React.FC = () => {
  const { isWsConnected, nodeName } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [tag, setTag] = useState<string>();
  const [topics, setTopics] = useState<string[]>();
  const [subscriptionType, setSubscriptionType] = useState<string>('ephemeral');
  const [subscriptionName, setSubscriptionName] = useState<string>('');

  const theme = useTheme();
  const [selectedSubscriptions, setselectedSubscriptions] = React.useState<
    string[]
  >([]);

  const handleChange = (
    event: SelectChangeEvent<typeof selectedSubscriptions>
  ) => {
    const {
      target: { value },
    } = event;
    setselectedSubscriptions(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setTag(undefined);
      return;
    }
    setTag(event.target.value);
  };

  const handleTopicsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setTopics(undefined);
      return;
    }
    setTopics([event.target.value]);
  };

  const handleSubscriptionTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: 'durable' | 'ephemeral'
  ) => {
    setSubscriptionType(newAlignment);
  };

  return (
    <Grid container item p={1} flexDirection="column">
      <Grid container p={1} spacing={DEFAULT_SPACING}>
        <Grid
          container
          item
          spacing={DEFAULT_SPACING}
          flexDirection="row"
          justifyContent={'space-between'}
        >
          <Grid spacing={DEFAULT_SPACING} item justifyContent={'flex-start'}>
            <ToggleButtonGroup
              size="small"
              disabled
              value={subscriptionType}
              exclusive
              onChange={handleSubscriptionTypeChange}
            >
              <ToggleButton value="durable">{t('durable')}</ToggleButton>
              <ToggleButton value="ephemeral">{t('ephemeral')}</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item justifyContent={'flex-end'}>
            <Tooltip
              title={
                isWsConnected
                  ? `${t('connectedToFirefly').toString()}: ${nodeName}`
                  : t('notConnectedToFirefly').toString()
              }
            >
              <Chip
                icon={
                  <CircleIcon
                    fontSize="small"
                    style={{
                      color: isWsConnected ? FFColors.Green : FFColors.Red,
                    }}
                  />
                }
                label={
                  isWsConnected
                    ? `${t('connected')}: ${nodeName}`
                    : t('notConnected')
                }
                sx={{ color: FFColors.Purple }}
                variant="outlined"
              />
            </Tooltip>
          </Grid>
        </Grid>
        {subscriptionType === 'durable' && (
          <Grid container item>
            <TextField
              label={t('name')}
              required
              fullWidth
              value={subscriptionName}
              onChange={(e) => setSubscriptionName(e.target.value)}
            />{' '}
          </Grid>
        )}
        <Grid container item>
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-chip-label">
              Subscribe to Events
            </InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={selectedSubscriptions}
              onChange={handleChange}
              input={
                <OutlinedInput
                  id="select-multiple-chip"
                  label="Subscribe to Events"
                />
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, selectedSubscriptions, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid container item justifyContent="flex-end">
          <Button
            endIcon={<ArrowForwardIos />}
            variant="contained"
            sx={{ borderRadius: DEFAULT_BORDER_RADIUS }}
            onClick={() => {
              return null;
            }}
          >
            <Typography>{t('connect')}</Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
