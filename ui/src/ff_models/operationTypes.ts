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

export enum OperationStatus {
  FAILED = 'Failed',
  PENDING = 'Pending',
  SUCCEEDED = 'Succeeded',
}

export enum FF_OPS {
  // Blockchain Event
  BLOCKCHAIN_PIN_BATCH = 'blockchain_pin_batch',
  BLOCKCHAIN_INVOKE = 'blockchain_invoke',
  //Message/Definitions
  SHAREDSTORAGE_UPLOAD_BATCH = 'sharedstorage_upload_batch',
  SHAREDSTORAGE_UPLOAD_BLOB = 'sharedstorage_upload_blob',
  SHAREDSTORAGE_DOWNLOAD_BATCH = 'sharedstorage_download_batch',
  SHAREDSTORAGE_DOWNLOAD_BLOB = 'sharedstorage_download_blob',
  DATAEXCHANGE_SEND_BATCH = 'dataexchange_send_batch',
  DATAEXCHANGE_SEND_BLOB = 'dataexchange_send_blob',
  // Transfers
  TOKEN_CREATE_POOL = 'token_create_pool',
  TOKEN_ACTIVATE_POOL = 'token_activate_pool',
  TOKEN_TRANSFER = 'token_transfer',
  TOKEN_APPROVAL = 'token_approval',
}
