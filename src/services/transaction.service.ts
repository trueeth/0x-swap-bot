import { Transaction, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import crypto from 'crypto'
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';

/**
 * Create a transaction
 * @param {Object} transactionBody
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (
  tokenIn: string,
  tokenOut: string,
  tokenInAmount: string,
  tokenOutAmount: string,
  fee: string,
  sender: string,
): Promise<Transaction> => {
  const id = crypto.randomUUID()
  return prisma.transaction.create({
    data: {
      id,
      tokenIn,
      tokenOut,
      tokenInAmount,
      tokenOutAmount,
      fee,
      sender
    }
  });
};


/**
 * Get transaction by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Transaction, Key> | null>}
 */
const getTransactionById = async <Key extends keyof Transaction>(
  id: string,
  keys: Key[] = [
    'id',
    'tokenIn',
    'tokenOut',
    'tokenInAmount',
    'tokenOutAmount',
    'fee',
    'sender',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Transaction, Key> | null> => {
  return prisma.transaction.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Transaction, Key> | null>;
};

/**
 * Delete transaction by id
 * @param {ObjectId} transactionId
 * @returns {Promise<Transaction>}
 */
const deleteTransactionById = async (transactionId: string): Promise<Transaction> => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  await prisma.transaction.delete({ where: { id: transaction.id } });
  return transaction;
};

export default {
  createTransaction,
  getTransactionById,
  deleteTransactionById
};
