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

import { createContext, Dispatch, SetStateAction } from 'react';
import { ISelfIdentity } from '../interfaces/api';

export interface IJsonPayloadContext {
  selfIdentity: ISelfIdentity | undefined;
  activeForm: string;
  setActiveForm: Dispatch<SetStateAction<string>>;
  jsonPayload: object;
  setJsonPayload: Dispatch<SetStateAction<object>>;
  apiResponse: object;
  setApiResponse: Dispatch<SetStateAction<object>>;
  apiStatus: object;
  setApiStatus: Dispatch<SetStateAction<object>>;
  logs: string[];
  setLogs: Dispatch<SetStateAction<string[]>>;
}

export const JsonPayloadContext = createContext({} as IJsonPayloadContext);
