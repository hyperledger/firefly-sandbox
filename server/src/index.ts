import * as http from 'http';
import * as express from 'express';
import apiRouter from './routers/api';

const PORT = 3000;

const app = express();

app.use('/api', apiRouter);

const server = new http.Server(app);
server.listen(PORT, () => console.log(`Application listening on port ${PORT}`));
