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
import { ITokenPool } from '../interfaces/api';
import { ITutorial } from '../interfaces/tutorialSection';

export interface IFormContext {
  action: string | null;
  setActionParam: (categoryID: string, formID: string) => void;
  categoryID: string | undefined;
  formID: string | undefined;
  formObject: ITutorial | undefined;
  isBlob: boolean;
  setIsBlob: Dispatch<SetStateAction<boolean>>;
  searchParams: URLSearchParams;
  poolObject: ITokenPool | undefined;
  setPoolObject: Dispatch<SetStateAction<ITokenPool | undefined>>;
}

export const FormContext = createContext({} as IFormContext);
