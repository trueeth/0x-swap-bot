import express from 'express';
import { botController } from '../../controllers';
import logger from '../../config/logger';

const router = express.Router();


router
  .route('/')
  .get(async (_req: any, res: any) => {
    logger.info("Weth Token Swap, get request")
    res.send("Weth token swap")
  })
  .post(botController.tokenSwap);




export default router;



/**
 * @swagger
 * tags:
 *   name: Bots
 *   description: Swap bot
 */


/**
 * @swagger
 * /bot:
 *   get:
 *     summary: Get a bot
 *     description: token auto swap bot.
 *     tags: [Bots]
 *
 */



