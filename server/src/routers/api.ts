import { Router } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { firefly } from '../clients/firefly';
import * as swaggerJson from '../../swagger.json';
import { BroadcastRequest } from './interfaces';

const router = Router();

/**
 * @openapi
 * /api/messages/broadcast:
 *   post:
 *     description: Send a FireFly broadcast message
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
 *         description: Message was accepted
 */
router.post('/messages/broadcast', async (req, res) => {
  const body: BroadcastRequest = req.body;
  const response = await firefly.sendBroadcast({
    header: {
      tag: body.tag,
      topics: [body.topic],
    },
    data: [{ value: body.value }],
  });
  res.status(202).send(response);
});

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerJson));

export default router;
