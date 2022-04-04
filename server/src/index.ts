import * as http from 'http';
import app from './app';

const PORT = 3000;

const server = new http.Server(app.e);

server.on('upgrade', function upgrade(request, socket, head) {
  if (!app.handleUpgrade(request, socket, head)) {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
  }
});

server.listen(PORT, () => console.log(`Application listening on port ${PORT}`));
