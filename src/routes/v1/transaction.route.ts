import express from 'express';
import transactionController from '../../controllers/transaction.controller';

const router = express.Router();


router
  .route('/')
  .get(transactionController.getTransactions)



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



