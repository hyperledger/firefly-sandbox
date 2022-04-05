import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as swaggerUi from 'swagger-ui-express';
import { WebSocketServer } from 'ws';
import * as swaggerJson from '../swagger.json';
import simpleRouter from './routers/simple';
import { WebsocketHandler } from './interfaces';
import * as cors from 'cors';

const app = express();
const websockets = new Map<string, WebSocketServer>();

const wsHandler: WebsocketHandler = {
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

const corsOpts = {
  origin: '*'
};

app.use(cors(corsOpts));
app.use(bodyParser.json());
app.use('/api/simple', simpleRouter(wsHandler));
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerJson));

const server = new http.Server(app);

server.on('upgrade', function upgrade(request, socket, head) {
  if (!wsHandler.handleUpgrade(request, socket, head)) {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
  }
});

export default server;
