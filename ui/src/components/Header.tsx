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

import {
  DescriptionOutlined,
  GitHub,
  QuestionMarkOutlined,
} from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import {
  AppBar,
  Chip,
  Grid,
  IconButton,
  styled,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { ReactComponent as DiscordLogo } from '../assets/Discord-Logo-White.svg';
import { ResourceUrls } from '../constants/ResourceUrls';
import { EventContext } from '../contexts/EventContext';
import { FF_EVENTS } from '../ff_models/eventTypes';
import { DEFAULT_PADDING, FFColors } from '../theme';
import { MenuLogo } from './Logos/MenuLogo';
import { InstructionModal } from './Modals/InstructionModal';

const WS_PATH = process.env.REACT_APP_WS_PATH || '/api/ws';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { addLogToHistory } = useContext(EventContext);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const webSocket = useRef<ReconnectingWebSocket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    connectToWS();
  }, []);

  const StyledDiscordLogo = styled(DiscordLogo)({
    width: 25,
    height: 25,
  });

  const connectToWS = () => {
    if (!wsConnected) {
      // Open websocket
      webSocket.current = new ReconnectingWebSocket(
        process.env.NODE_ENV === 'development'
          ? `ws://localhost:3001${WS_PATH}`
          : `ws://${window.location.host}${WS_PATH}`
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
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          px: DEFAULT_PADDING,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Toolbar disableGutters>
          <Grid container direction="row" alignItems={'center'}>
            <Grid item container justifyContent={'flex-start'} xs={6}>
              <Typography variant="h6" noWrap component="div">
                <MenuLogo />
              </Typography>
            </Grid>
            <Grid
              item
              container
              justifyContent={'flex-end'}
              xs={6}
              alignItems="center"
            >
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
              {/* Docs */}
              <IconButton
                color="secondary"
                onClick={() => window.open(ResourceUrls.fireflyTutorial)}
                size="small"
              >
                <DescriptionOutlined />
              </IconButton>
              {/* Github */}
              <IconButton
                color="secondary"
                onClick={() => window.open(ResourceUrls.sandBoxGH)}
                size="small"
              >
                <GitHub />
              </IconButton>
              {/* Discord */}
              <IconButton
                color="secondary"
                onClick={() => window.open(ResourceUrls.fireflyDiscordInvite)}
                size="small"
              >
                <StyledDiscordLogo />
              </IconButton>
              {/* Help */}
              <IconButton
                color="secondary"
                onClick={() => setIsModalOpen(true)}
                size="small"
              >
                <QuestionMarkOutlined />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {isModalOpen && (
        <InstructionModal
          isOpen={isModalOpen}
          handleModalOpen={(open: boolean) => setIsModalOpen(open)}
        />
      )}
    </>
  );
};
