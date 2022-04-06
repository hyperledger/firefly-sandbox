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
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../contexts/ApplicationContext';
import { FFColors } from '../theme';
import { MenuLogo } from './Logos/MenuLogo';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { isWsConnected, nodeName } = useContext(ApplicationContext);
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
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
