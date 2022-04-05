import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_PADDING,
  DEFAULT_SPACING,
  FFColors,
} from '../../../theme';
import * as React from 'react';
import { ArrowForwardIos } from '@mui/icons-material';

const AVAILABLE_SUBSCRIPTIONS = [
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

export const EventSubscription: React.FC = () => {
  const { t } = useTranslation();

  const [subscriptionType, setSubscriptionType] = useState<string>('ephemeral');
  const [subscriptionName, setSubscriptionName] = useState<string>('');
  const [connectingStatus, setConnectingStatus] = useState<string>('');
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const webSocket: any = useRef(null);

  React.useEffect(() => {
    if (!wsConnected && connectingStatus === 'connecting') {
      webSocket.current = new WebSocket('ws://localhost:3001/api/simple/ws');
      console.log(webSocket);
      setWsConnected(true);
      webSocket.current.onmessage = (message: any) => {
        console.log(message);
        setLogs((prev) => [...prev, message.data]);
      };
    } else {
      if (connectingStatus === 'disconnecting' && webSocket.current) {
        console.log('closing ws');
        webSocket.current.close();
        setWsConnected(false);
      }
    }
  }, [wsConnected, connectingStatus]);

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
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleSubscriptionTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: 'durable' | 'ephemeral'
  ) => {
    setSubscriptionType(newAlignment);
  };

  const handleConnect = () => {
    setConnectingStatus(
      connectingStatus === 'connecting' ? 'disconnecting' : 'connecting'
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <Grid pb={DEFAULT_PADDING}>
        <Grid item pl={DEFAULT_PADDING} pt={DEFAULT_PADDING}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('eventSubscription')}
          </Typography>
        </Grid>
        <Grid container item p={DEFAULT_PADDING}>
          <Paper sx={{ width: '100%' }}>
            <Grid container spacing={1} p={2} wrap="wrap">
              <Grid container item p={1} flexDirection="column">
                <Grid container p={1} spacing={DEFAULT_SPACING}>
                  <Grid
                    container
                    item
                    spacing={DEFAULT_SPACING}
                    flexDirection="row"
                    justifyContent={'space-between'}
                  >
                    <Grid item justifyContent={'flex-start'}>
                      <ToggleButtonGroup
                        size="small"
                        disabled
                        value={subscriptionType}
                        exclusive
                        onChange={handleSubscriptionTypeChange}
                      >
                        <ToggleButton value="durable">
                          {t('durable')}
                        </ToggleButton>
                        <ToggleButton value="ephemeral">
                          {t('ephemeral')}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>
                    <Grid item justifyContent={'flex-end'}>
                      <Chip
                        icon={
                          <CircleIcon
                            fontSize="small"
                            style={{
                              color: wsConnected
                                ? FFColors.Green
                                : FFColors.Red,
                            }}
                          />
                        }
                        label={wsConnected ? t('connected') : t('notConnected')}
                        sx={{ color: FFColors.Purple }}
                        variant="outlined"
                      />
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
                      <InputLabel id="event-subscriptions-selection-label">
                        Subscribe to Events
                      </InputLabel>
                      <Select
                        labelId="event-subscriptions-selection-label"
                        id="event-subscriptions-selection"
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
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {AVAILABLE_SUBSCRIPTIONS.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(
                              name,
                              selectedSubscriptions,
                              theme
                            )}
                          >
                            <Checkbox
                              checked={selectedSubscriptions.indexOf(name) > -1}
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  justifyContent="flex-end"
                  pt={DEFAULT_PADDING}
                >
                  <Button
                    endIcon={<ArrowForwardIos />}
                    variant="contained"
                    sx={{ borderRadius: DEFAULT_BORDER_RADIUS }}
                    onClick={handleConnect}
                  >
                    <Typography>
                      {connectingStatus === 'connecting'
                        ? t('disconnect')
                        : t('connect')}
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item pl={DEFAULT_PADDING}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('eventLogs')}
          </Typography>
        </Grid>
        <Grid container item p={DEFAULT_PADDING}>
          <Paper
            sx={{
              width: '100%',
            }}
          >
            <Grid container p={2}>
              <Grid container item p={1}>
                <Box
                  component="div"
                  sx={{
                    whiteSpace: 'normal',
                    height: 'auto',
                  }}
                >
                  <Typography
                    align="left"
                    style={{
                      fontSize: '12px',
                      maxWidth: '450px',
                      maxHeight: '450px',
                      wordWrap: 'break-word',
                      overflow: 'scroll',
                    }}
                  >
                    {logs.length === 0
                      ? 'Subscribe to events to view logs.'
                      : logs.toString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
