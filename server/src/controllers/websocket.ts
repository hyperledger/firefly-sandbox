import { FireFlySubscriptionBase } from '@photic/firefly-sdk-nodejs';
import { nanoid } from 'nanoid';
import { firefly } from '../clients/firefly';
import { WebsocketHandler } from '../utils';
import Logger from '../logger';

/**
 * Simple WebSocket Server
 */
export class SimpleWebSocket {
  logger = new Logger(SimpleWebSocket.name);
  path = '/ws';

  init(prefix: string, wsHandler: WebsocketHandler) {
    wsHandler.addWebsocket(prefix + this.path).on('connection', (client, request) => {
      // Each time a client connects to this server, open a corresponding connection to FireFly
      const id = nanoid();
      this.logger.log(`Connecting websocket client ${id}`);
      const url = new URL(request.url ?? '', `http://${request.headers.host}`);
      const sub: FireFlySubscriptionBase = {
        filter: {
          events: url.searchParams.get('filter.events') ?? undefined,
        },
      };

      const ffSocket = firefly.listen(sub, async (socket, event) => {
        if (event.type === 'transaction_submitted' && event.transaction?.type === 'batch_pin') {
          // Enrich batch_pin transaction events with details on the batch
          const batches = await firefly.getBatches({ 'tx.id': event.tx });
          event['batch'] = batches[0];
        }

        // Forward the event to the client
        client.send(JSON.stringify(event));
      });

      client.on('close', () => {
        this.logger.log(`Disconnecting websocket client ${id}`);
        ffSocket.close();
      });
    });
  }
}
