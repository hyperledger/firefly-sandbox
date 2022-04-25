import * as http from 'http';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import 'reflect-metadata';
import { RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import * as swaggerUi from 'swagger-ui-express';
import { CommonController } from './controllers/common';
import { ContractsController, ContractsTemplateController } from './controllers/contracts';
import { MessagesController, MessagesTemplateController } from './controllers/messages';
import { TokensController, TokensTemplateController } from './controllers/tokens';
import { SimpleWebSocket } from './controllers/websocket';
import { genOpenAPI, WebsocketHandler } from './utils';
import { DatatypesController } from './controllers/datatypes';

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

const serverOptions: RoutingControllersOptions = {
  routePrefix: '/api',
  controllers: [
    CommonController,
    MessagesController,
    MessagesTemplateController,
    TokensController,
    TokensTemplateController,
    ContractsController,
    ContractsTemplateController,
    DatatypesController,
  ],
};
const wsConfig = {
  prefix: '/api',
  handler: new WebsocketHandler(),
  websockets: [SimpleWebSocket],
};

useExpressServer(app, serverOptions);
wsConfig.websockets.forEach((w) => new w().init(wsConfig.prefix, wsConfig.handler));

const api = genOpenAPI(serverOptions);

app.use('/api', swaggerUi.serve);
app.get('/api', swaggerUi.setup(api));
app.get('/api-json', (req, res) => {
  res.type('text').send(JSON.stringify(api, null, 2));
});

const UI_PATH = process.env.UI_PATH;
if (UI_PATH) {
  console.log(`UI Served from ${UI_PATH}`);
  app.use(express.static(path.resolve(`${UI_PATH}/`)));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(`${UI_PATH}/index.html`));
  });
}

const server = new http.Server(app);
server.on('upgrade', function upgrade(request, socket, head) {
  if (!wsConfig.handler.handleUpgrade(request, socket, head)) {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
  }
});
export default server;
