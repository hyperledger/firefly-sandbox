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

import CircleIcon from '@mui/icons-material/Circle';
import {
  AppBar,
  Chip,
  Container,
  Grid,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { EventContext } from '../contexts/EventContext';
import { FF_EVENTS } from '../ff_models/eventTypes';
import { FFColors } from '../theme';
import { MenuLogo } from './Logos/MenuLogo';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { addLogToHistory } = useContext(EventContext);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const webSocket = useRef<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    connectToWS();
  }, []);

  const connectToWS = () => {
    if (!wsConnected) {
      // Open websocket
      webSocket.current = new ReconnectingWebSocket(
        process.env.NODE_ENV === 'development'
          ? 'ws://localhost:3001/api/ws'
          : `ws://${window.location.host}/api/ws`
      );
      // On Open
      webSocket.current.onopen = function () {
        setWsConnected(true);
      };
      // On Message
      webSocket.current.onmessage = (message: any) => {
        const eventData = JSON.parse(message.data);
        const eventType: FF_EVENTS = eventData.type;
        if (Object.values(FF_EVENTS).includes(eventType)) {
          addLogToHistory(eventData);
        }
      };
    } else {
      // Close websocket
      webSocket.current?.close();
      setWsConnected(false);
    }
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Grid container direction="row" alignItems={'center'}>
            <Grid item container justifyContent={'flex-start'} xs={6}>
              <Typography variant="h6" noWrap component="div">
                <MenuLogo />
              </Typography>
            </Grid>
            <Grid item container justifyContent={'flex-end'} xs={6}>
              <Tooltip
                title={
                  wsConnected
                    ? t('connectedToFirefly').toString()
                    : t('notConnectedToFirefly').toString()
                }
              >
                <Chip
                  icon={
                    <CircleIcon
                      fontSize="small"
                      style={{
                        color: wsConnected ? FFColors.Green : FFColors.Red,
                      }}
                    />
                  }
                  label={wsConnected ? t('connected') : t('notConnected')}
                  sx={{
                    color: FFColors.White,
                    cursor: 'pointer',
                    width: '20%',
                  }}
                  variant="outlined"
                  onClick={connectToWS}
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
