import { Router } from 'express';
import { FireFlySubscriptionBase } from '@photic/firefly-sdk-nodejs';
import { nanoid } from 'nanoid';
import { firefly } from '../clients/firefly';
import { BroadcastRequest, WebsocketHandler } from '../interfaces';

export default function (app: WebsocketHandler) {
  const router = Router();
  const wss = app.addWebsocket('/api/simple/ws');

  wss.on('connection', (client, request) => {
    const id = nanoid();
    console.log(`Connecting websocket client ${id}`);

    const url = new URL(request.url ?? '', `http://${request.headers.host}`);
    const sub: FireFlySubscriptionBase = {
      filter: {
        events: url.searchParams.get('filter.events') ?? undefined,
      },
    };
    const ffSocket = firefly.listen(sub, (socket, data) => {
      client.send(JSON.stringify(data));
    });
    client.on('close', () => {
      console.log(`Disconnecting websocket client ${id}`);
      ffSocket.close();
    });
  });

  /**
   * @openapi
   * /api/simple/broadcast:
   *   post:
   *     summary: Send a FireFly broadcast message
   *     tags:
   *       - Simple Operations
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               topic:
   *                 type: string
   *               tag:
   *                 type: string
   *               value:
   *                 type: string
   *     responses:
   *       202:
   *         description: Accepted
   */
  router.post('/broadcast', async (req, res) => {
    console.log('Sending broadcast message');
    const body: BroadcastRequest = req.body;
    const response = await firefly.sendBroadcast({
      header: {
        tag: body.tag ?? '',
        topics: body.topic !== undefined ? [body.topic] : body.topic,
      },
      data: [{ value: body.value }],
    });
    res.status(202).send(response);
  });

  return router;
}
