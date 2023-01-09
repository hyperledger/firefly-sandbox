import { FireFlySubscriptionBase } from '@hyperledger/firefly-sdk';
import { nanoid } from 'nanoid';
import { getFireflyClient } from '../clients/fireflySDKWrapper';
import { FF_EVENTS, FF_TX } from '../enums';
import Logger from '../logger';
import { mapPool, WebsocketHandler } from '../utils';

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
      const namespace = url.searchParams.get('ns');
      if (!namespace) {
        this.logger.error(`No namespace provided for client ${id}, aborting websocket setup.`);
        return;
      }
      this.logger.log(
        `Setting up websocket client ${id} to listen to events from '${namespace}' namespace.`,
      );
      const firefly = getFireflyClient(namespace);
      const ffSocket = firefly.listen(sub, async (socket, event) => {
        if (event.type === FF_EVENTS.TX_SUBMITTED) {
          if (event.transaction?.type === FF_TX.BATCH_PIN) {
            // Enrich batch_pin transaction events with details on the batch
            const batches = await firefly.getBatches({ 'tx.id': event.tx });
            event['batch'] = batches[0];
          } else if (event.transaction?.type === FF_TX.TOKEN_TRANSFER) {
            // Enrich token_transfer transaction events with pool ID
            const operations = await firefly.getOperations({
              tx: event.tx,
              type: FF_TX.TOKEN_TRANSFER,
            });
            if (operations.length > 0) {
              event['pool'] = mapPool(await firefly.getTokenPool(operations[0].input?.pool));
            }
          } else if (event.transaction?.type === FF_TX.TOKEN_APPROVAL) {
            // Enrich token_approval transaction events with pool ID
            const operations = await firefly.getOperations({
              tx: event.tx,
              type: FF_TX.TOKEN_APPROVAL,
            });
            if (operations.length > 0) {
              event['pool'] = mapPool(await firefly.getTokenPool(operations[0].input?.pool));
            }
          }
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
