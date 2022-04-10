// Copyright © 2022 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ArrowForwardIos } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  SelectChangeEvent,
  Theme,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { JsonPayloadContext } from '../contexts/JsonPayloadContext';
import { getEnrichedEventText } from '../ff_models/eventTypes';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_PADDING,
  DEFAULT_SPACING,
  FFColors,
} from '../theme';
import { MenuLogo } from './Logos/MenuLogo';

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

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { logs, setLogs } = useContext(JsonPayloadContext);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const [connectingStatus, setConnectingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  const [selectedSubscriptions, setselectedSubscriptions] = useState<string[]>(
    []
  );

  const webSocket: any = useRef(null);

  useEffect(() => {
    // if (connectingStatus === 'reconnect') {
    //   webSocket.current.close();
    //   setWsConnected(false);
    //   setConnectingStatus('connecting');
    // }
    if (!wsConnected && connectingStatus === 'connecting') {
      webSocket.current = new WebSocket(
        `ws://localhost:3001/api/ws?filter.events=${selectedSubscriptions
          .toString()
          .replaceAll(',', '|')}`
      );
      webSocket.current.onerror = function () {
        setErrorMessage(t('websocketConnectionFailure'));
      };
      webSocket.current.onopen = function () {
        setWsConnected(true);
        setErrorMessage('');
      };
      console.log(webSocket);

      webSocket.current.onmessage = (message: any) => {
        console.log(message);
        const event = getEnrichedEventText(JSON.parse(message.data)) + '\n';
        setLogs((prev) => [...prev, event]);
      };
    } else {
      if (connectingStatus === 'disconnecting' && webSocket.current) {
        console.log('closing ws');
        webSocket.current.close();
        setWsConnected(false);
      }
    }
  }, [wsConnected, connectingStatus]);

  useEffect(() => {
    if (wsConnected) {
      setConnectingStatus('reconnect');
    }
  }, [selectedSubscriptions]);

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

  const handleConnect = () => {
    if (connectingStatus === 'reconnect') {
      setConnectingStatus('disconnecting');
      setWsConnected(false);
      setConnectingStatus('connecting');
    } else {
      setConnectingStatus(
        connectingStatus === 'connecting' ? 'disconnecting' : 'connecting'
      );
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Grid container direction="row" alignItems={'center'}>
            <Grid item container justifyContent={'flex-start'} xs={6}>
              <Typography variant="h6" noWrap component="div">
                <MenuLogo />
              </Typography>
            </Grid>
            <Grid item container justifyContent={'flex-end'} xs={6}>
              <Button sx={{ textTransform: 'none' }} onClick={handleClick}>
                <Chip
                  icon={
                    <CircleIcon
                      fontSize="small"
                      style={{
                        color: wsConnected ? FFColors.Green : FFColors.Red,
                      }}
                    />
                  }
                  label={wsConnected ? `${t('connected')}` : t('notConnected')}
                  sx={{ color: FFColors.White }}
                  variant="outlined"
                />
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Grid container item p={DEFAULT_PADDING}>
                  <Grid container spacing={1} p={2} wrap="wrap">
                    <Grid container item p={1} flexDirection="column">
                      <Grid container p={1} spacing={DEFAULT_SPACING}>
                        <Grid container item>
                          <FormControl
                            fullWidth
                            sx={{
                              width: '500px',
                            }}
                          >
                            <InputLabel id="event-subscriptions-selection-label">
                              {t('filterEventSubscriptions')}
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
                                  label={t('filterEventSubscriptions')}
                                />
                              }
                              renderValue={(selected) => (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                  }}
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
                                    checked={
                                      selectedSubscriptions.indexOf(name) > -1
                                    }
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
                            {wsConnected
                              ? connectingStatus === 'reconnect'
                                ? t('refreshConnection')
                                : t('disconnect')
                              : t('connect')}
                          </Typography>
                        </Button>
                      </Grid>
                      <Grid container item>
                        <Typography>{errorMessage}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Popover>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
