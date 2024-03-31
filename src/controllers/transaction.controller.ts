import catchAsync from "../utils/catchAsync";
import { transactionService } from '../services';
import pick from "../utils/pick";
import { filter } from "compression";


const getTransactions = catchAsync(async (req, res) => {
    const options = pick(req.query, ['type', 'limit', 'page']);
    const filters = pick(req.query, ['txType']);
    const transactions = await transactionService.queryGetTransactions(options, filters)
    const counts = await transactionService.getTransactionCountsByFilter()
    res.send({ transactions, counts })
})

export default {
    getTransactions
}