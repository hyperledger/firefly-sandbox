import { Router } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { firefly } from '../clients/firefly';
import * as swaggerJson from '../../swagger.json';

const router = Router();

/**
 * @openapi
 * /api/messages/broadcast:
 *   post:
 *     description: Send a FireFly broadcast message
 *     responses:
 *       202:
 *         description: Message was accepted.
 */
router.post('/messages/broadcast', async (req, res) => {
  const response = await firefly.sendBroadcast({
    data: [{ value: 'Hello' }],
  });
  res.status(202).send(response);
});

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerJson));

export default router;
