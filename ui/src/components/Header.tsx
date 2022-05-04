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
  MoreVert,
  QuestionMarkOutlined,
} from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import {
  AppBar,
  Chip,
  Grid,
  IconButton,
  Menu,
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
import { DEFAULT_BORDER_RADIUS, DEFAULT_PADDING, FFColors } from '../theme';
import { MenuLogo } from './Logos/MenuLogo';
import { FFMenuItem } from './Menus/FFMenuItem';
import { InstructionModal } from './Modals/InstructionModal';

const WS_PATH = process.env.REACT_APP_WS_PATH || '/api/ws';
const menuID = 'ff-dropdown-menu';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { addLogToHistory } = useContext(EventContext);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const webSocket = useRef<ReconnectingWebSocket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    connectToWS();
  }, []);

  const StyledDiscordLogo = styled(DiscordLogo)({
    width: 20,
    height: 20,
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    {
      icon: <DescriptionOutlined />,
      title: t('docs'),
      url: ResourceUrls.fireflyTutorial,
    },
    {
      icon: <GitHub />,
      title: t('github'),
      url: ResourceUrls.sandBoxGH,
    },
    {
      icon: <StyledDiscordLogo />,
      title: t('discord'),
      url: ResourceUrls.fireflyDiscordInvite,
    },
  ];

  const dropdownMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuID}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {menuItems.map((item) => (
        <FFMenuItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          url={item.url}
        />
      ))}
    </Menu>
  );

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
                    width: 130,
                    borderRadius: DEFAULT_BORDER_RADIUS,
                    fontSize: '12px',
                  }}
                  variant="outlined"
                  onClick={connectToWS}
                />
              </Tooltip>
              <IconButton
                color="inherit"
                onClick={() => setIsModalOpen(true)}
                size="small"
                sx={{ ml: 1 }}
              >
                <QuestionMarkOutlined />
              </IconButton>
              <IconButton
                edge="end"
                aria-controls={menuID}
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ mr: 1 }}
                size="small"
              >
                <MoreVert />
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
      {dropdownMenu}
    </>
  );
};
