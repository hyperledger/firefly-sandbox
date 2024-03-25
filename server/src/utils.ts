import * as http from 'http';
import { Duplex } from 'stream';
import { WebSocketServer } from 'ws';
import { FireFlyDataRequest, FireFlyTokenPoolResponse } from '@hyperledger/firefly-sdk';
import stripIndent = require('strip-indent');
import { BroadcastValue, PrivateValue } from './interfaces';

export enum FF_MESSAGES {
  // Definition
  DEFINITON = 'definition',
  // Broadcast
  BROADCAST = 'broadcast',
  TRANSFER_BROADCAST = 'transfer_broadcast',
  // Private
  PRIVATE = 'private',
  TRANSFER_PRIVATE = 'transfer_private',
  GROUP_INIT = 'groupinit',
}

export class WebsocketHandler {
  websockets = new Map<string, WebSocketServer>();

  addWebsocket(path: string) {
    const wss = new WebSocketServer({ noServer: true });
    this.websockets.set(path, wss);
    return wss;
  }

  handleUpgrade(request: http.IncomingMessage, socket: Duplex, head: Buffer) {
    const url = new URL(request.url ?? '', `http://${request.headers.host}`);
    const wss = this.websockets.get(url.pathname);
    if (wss === undefined) {
      return false;
    }
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
    return true;
  }
}

export function formatTemplate(template: string) {
  return stripIndent(template).trim();
}

export enum EmptyVal {
  UNDEFINED = 0, // replace empty values with 'undefined'
  OMIT, // replace empty values with ''
  STRING, // replace empty values with an empty string "''"
}
export interface QuoteOptions {
  isObject?: boolean;
  truncate?: boolean;
  empty?: EmptyVal;
}

export function quoteAndEscape(varName: string, options?: QuoteOptions) {
  let result = varName;
  if (options?.isObject) {
    result = `JSON.stringify(${result})`;
  } else {
    result = `new String(${result})`;
  }
  if (options?.truncate) {
    const maxLength = 20;
    const halfLength = maxLength / 2;
    result = `(${result}.length > ${maxLength}
      ? ${result}.substring(0, ${halfLength}) + ' ... ' + ${result}.substring(${result}.length - ${halfLength})
      : ${result})`;
  }
  if (!options?.isObject) {
    result = `"'" + ${result}.replaceAll("'", "\\\\'") + "'"`;
  }
  const emptyVal =
    options?.empty === EmptyVal.OMIT
      ? "''"
      : options?.empty === EmptyVal.STRING
      ? '"\'\'"'
      : "'undefined'";
  result = `(${varName} ? (${result}) : ${emptyVal})`;
  return result;
}

export function getBroadcastMessageBody(
  body: BroadcastValue,
  blobId?: string,
  messageType?: FF_MESSAGES,
) {
  const dataBody = blobId ? { id: blobId } : getMessageBody(body);
  return {
    header: {
      tag: body.tag || undefined,
      topics: body.topic ? [body.topic] : undefined,
      type: messageType || undefined,
    },
    data: [dataBody],
  };
}

export function getPrivateMessageBody(
  body: PrivateValue,
  blobId?: string,
  messageType?: FF_MESSAGES,
) {
  const dataBody = blobId ? { id: blobId } : getMessageBody(body);
  return {
    header: {
      tag: body.tag || undefined,
      topics: body.topic ? [body.topic] : undefined,
      type: messageType || undefined,
    },
    group: {
      members: body.recipients.map((r) => ({ identity: r })),
    },
    data: [dataBody],
  };
}

export function getMessageBody(body: any) {
  const dataBody: FireFlyDataRequest = {};
  dataBody.value = body.value || body.jsonValue;
  if (body.jsonValue && body.datatypename && body.datatypeversion) {
    dataBody.datatype = {
      name: body.datatypename,
      version: body.datatypeversion,
    };
  }
  return dataBody;
}

export function mapPool(pool: FireFlyTokenPoolResponse) {
  // Some contracts (base ERC20/ERC721) do not support passing extra data.
  // The UI needs to adjust for this, as some items won't reliably confirm.
  const schema: string = pool.info?.schema ?? '';
  return {
    id: pool.id,
    name: pool.name,
    symbol: pool.symbol,
    type: pool.type,
    decimals: pool.decimals ?? 0,
    dataSupport: schema.indexOf('NoData') === -1,
  };
}
