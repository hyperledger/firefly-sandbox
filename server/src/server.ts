import 'reflect-metadata';
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as swaggerUi from 'swagger-ui-express';
import { useExpressServer, RoutingControllersOptions } from 'routing-controllers';
import { genOpenAPI, WebsocketHandler } from './utils';
import simpleController from './controllers/simple';

const app = express();
app.use(bodyParser.json());

const controllers = [simpleController];
const serverOptions: RoutingControllersOptions = { routePrefix: '/api', controllers };
const wsHandler = new WebsocketHandler();
controllers.forEach((c) => c.init(wsHandler));

useExpressServer(app, serverOptions);
app.use('/api', swaggerUi.serve);
app.get('/api', swaggerUi.setup(genOpenAPI(serverOptions)));

const server = new http.Server(app);
server.on('upgrade', function upgrade(request, socket, head) {
  if (!wsHandler.handleUpgrade(request, socket, head)) {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
  }
});
export default server;
