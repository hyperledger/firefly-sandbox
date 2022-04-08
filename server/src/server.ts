import 'reflect-metadata';
import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as swaggerUi from 'swagger-ui-express';
import { useExpressServer, RoutingControllersOptions } from 'routing-controllers';
import { genOpenAPI, WebsocketHandler } from './utils';
import { MessagesController, MessagesTemplateController } from './controllers/messages';
import { TokensController, TokensTemplateController } from './controllers/tokens';
import { CommonController } from './controllers/common';
import { SimpleWebSocket } from './controllers/websocket';
import { ContractsController, ContractsTemplateController } from './controllers/contracts';

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

const server = new http.Server(app);
server.on('upgrade', function upgrade(request, socket, head) {
  if (!wsConfig.handler.handleUpgrade(request, socket, head)) {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
  }
});
export default server;
