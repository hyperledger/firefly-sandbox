import { Router } from 'express';
import { firefly } from '../clients/firefly';
import { BroadcastRequest, SampleApp } from '../interfaces';

export default function (app: SampleApp) {
  const router = Router();
  const wss = app.addWebsocket('/api/simple/ws');

  firefly.listen({}, (socket, data) => {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(data));
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
