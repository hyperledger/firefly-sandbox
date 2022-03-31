import * as http from 'http';
import { app } from './app';

const PORT = 3000;

const server = new http.Server(app);
server.listen(PORT, () => console.log(`Application listening on port ${PORT}`));
