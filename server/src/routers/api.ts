import { Router } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { firefly } from '../clients/firefly';

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
  await firefly.sendBroadcast({
    data: [{ value: 'Hello' }],
  });
  res.status(202).send();
});

router.use('/', swaggerUi.serve, swaggerUi.setup(YAML.load(`${__dirname}/../../swagger.yaml`)));

export default router;
