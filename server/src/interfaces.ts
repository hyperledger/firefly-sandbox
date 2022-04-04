import * as http from 'http';
import { Duplex } from 'stream';
import * as express from 'express';
import { WebSocketServer } from 'ws';

export interface BroadcastRequest {
  topic?: string;
  tag?: string;
  value?: string;
}

export interface SampleApp {
  e: ReturnType<typeof express>;
  addWebsocket: (path: string) => WebSocketServer;
  handleUpgrade: (request: http.IncomingMessage, socket: Duplex, head: Buffer) => boolean;
}
