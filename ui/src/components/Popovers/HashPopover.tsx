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

import { ContentCopy } from '@mui/icons-material';
import {
  Chip,
  Grid,
  IconButton,
  Popover,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { DEFAULT_BORDER_RADIUS } from '../../theme';
import { getShortHash } from '../../utils/strings';

interface Props {
  address: string;
  shortHash?: boolean;
  fullLength?: boolean;
  paper?: boolean;
}

export const HashPopover: React.FC<Props> = ({
  address,
  shortHash,
  paper,
  fullLength,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  return (
    <>
      <Chip
        label={shortHash ? getShortHash(address) : address}
        sx={{
          width: fullLength ? '100%' : shortHash ? 110 : 200,
          color: theme.palette.text.primary,
          borderRadius: DEFAULT_BORDER_RADIUS,
          fontSize: '12px',
          backgroundColor: paper
            ? theme.palette.background.paper
            : theme.palette.background.default,
          '&:hover, &:focus': {
            backgroundColor: paper
              ? theme.palette.background.paper
              : theme.palette.background.default,
          },
        }}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
        ref={anchorRef}
      />
      <Popover
        sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1 }}
        open={open}
        anchorEl={anchorRef.current}
        onBackdropClick={(event) => {
          event.stopPropagation();
          setOpen(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Grid
          alignItems="center"
          spacing={1}
          container
          direction="row"
          sx={{ padding: theme.spacing(1) }}
        >
          <Grid item>
            <Typography>{address}</Typography>
          </Grid>
          <Grid item>
            <CopyToClipboard text={address}>
              <IconButton
                sx={{ color: theme.palette.text.primary, padding: 0 }}
                size="large"
              >
                <ContentCopy />
              </IconButton>
            </CopyToClipboard>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};
