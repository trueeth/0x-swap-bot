import { Transaction } from '@prisma/client';
import httpStatus from 'http-status';
import crypto from 'crypto'
import prisma from '../client';
import ApiError from '../utils/ApiError';

/**
 * Create a transaction
 * @param {Object} transactionBody
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (
  txHash: string,
  txType: string,
  amount: string,
  price: string,
): Promise<Transaction> => {
  const id = crypto.randomUUID()
  return prisma.transaction.create({
    data: {
      id,
      txHash,
      txType,
      amount,
      fee: "",
      sender: "",
      price
    }
  });
};


/**
 * Query for transactions
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGetTransactions = async <Key extends keyof Transaction>(
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  filter: object = {
    id: {
      not: ""
    }
  },
  keys: Key[] = [
    'id',
    'txHash',
    'txType',
    'amount',
    'price',
    'createdAt',
  ] as Key[]
): Promise<Pick<Transaction, Key>[]> => {
  console.log(filter)
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy ?? 'createdAt';
  const sortType = options.sortType ?? 'desc';
  const transactions = await prisma.transaction.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: Number(limit),
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return transactions as Pick<Transaction, Key>[];
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
    'txHash',
    'txType',
    'amount',
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


/**
 * Get counts by filter
 * @returns {Promise<Number>}
 */
const getTransactionCountsByFilter = async (): Promise<Number> => {
  const counts = await prisma.transaction.count()

  return counts;
};

export default {
  createTransaction,
  queryGetTransactions,
  getTransactionById,
  deleteTransactionById,
  getTransactionCountsByFilter
};