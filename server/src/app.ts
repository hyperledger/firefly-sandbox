import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as swaggerUi from 'swagger-ui-express';
import { WebSocketServer } from 'ws';
import * as swaggerJson from '../swagger.json';
import simpleRouter from './routers/simple';
import { SampleApp } from './interfaces';

const websockets = new Map<string, WebSocketServer>();

const app: SampleApp = {
  e: express(),

  addWebsocket: (path) => {
    const wss = new WebSocketServer({ noServer: true });
    websockets.set(path, wss);
    return wss;
  },

  handleUpgrade: (request, socket, head) => {
    const url = new URL(request.url ?? '', `http://${request.headers.host}`);
    const wss = websockets.get(url.pathname);
    if (wss === undefined) {
      return false;
    }
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
    return true;
  },
};

app.e.use(bodyParser.json());
app.e.use('/api/simple', simpleRouter(app));
app.e.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerJson));

export default app;
