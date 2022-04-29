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

import { Alert, Snackbar } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const TRANSITION_TIMEOUT = 400;
export type SnackbarMessageType = 'error' | 'success';

interface MessageSnackbarProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  messageType?: SnackbarMessageType;
}

export const MessageSnackbar: React.FC<MessageSnackbarProps> = ({
  message,
  setMessage,
  messageType = 'success',
}) => {
  const [open, setOpen] = useState(message ? true : false);
  const timeoutRef = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  const handleClose = () => {
    window.clearTimeout(timeoutRef.current);
    setOpen(false);
    timeoutRef.current = window.setTimeout(
      () => setMessage(''),
      TRANSITION_TIMEOUT
    );
  };

  useEffect(() => {
    setOpen(message ? true : false);
  }, [message]);

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={messageType === 'error' ? 60000 : 4000}
    >
      <Alert
        onClose={handleClose}
        severity={messageType}
        sx={{ width: '100%' }}
        variant={'filled'}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
