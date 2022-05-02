import server from './server';

const PORT = process.env.SERVER_PORT || 3001;

server.listen(PORT, () => console.log(`Application listening on port ${PORT}`));
