import { ethers, parseUnits } from 'ethers'
import axios from 'axios';
import qs from 'qs'
import catchAsync from "../utils/catchAsync";
import { TOKENS } from '../config/tokens';
import { transactionService } from '../services';
import logger from '../config/logger';



const privateKey = '0xa9e8441aac698a08084409a174cd4644cba29799105fc9c49170cee9530342be'
const provider = new ethers.InfuraProvider('arbitrum', 'e501a1e7ffe74c2c950d23e6140caf6c')
const wallet = new ethers.Wallet(privateKey, provider)

enum ETxType {
    buy = "BUY",
    sell = "SELL"
}


const tokenSwap = catchAsync(async (req, res) => {
    let query = null
    const amount = 1
    let type = ETxType.buy
    if (req.body?.text == "BUYWETH") {
        type = ETxType.buy
        query = {
            sellToken: TOKENS['usdt']?.address as string,
            buyToken: TOKENS['weth']?.address as string,
            sellAmount: parseUnits(amount.toString(), TOKENS['usdt']?.decimals).toString(),
            takerAddress: wallet.address,
        }
    } else if (req.body?.text == "SELLWETH") {
        type = ETxType.sell
        query = {
            sellToken: TOKENS['weth']?.address as string,
            buyToken: TOKENS['usdt']?.address as string,
            sellAmount: parseUnits('0.0002', TOKENS['weth']?.decimals).toString(),
            takerAddress: wallet.address,
        }
    }

    if (!query) {
        res.send(null)
        logger.error("Invalid request type. Please check again.", req.body)
        return
    }

    const sQuery = qs.stringify(query)
    let price = 0;
    try {
        const quote = await axios.get(
            `https://arbitrum.api.0x.org/swap/v1/quote?${sQuery}`,
            {
                headers: {
                    "0x-api-key": "2f208c85-9162-4be4-89bd-ba1ac1291c9f",
                },
            }
        );

        price = type === ETxType.buy ? 1.0 / Number(quote.data?.price).valueOf() : Number(quote.data?.price)
        const tx = await wallet.sendTransaction({
            data: quote.data.data,
            to: quote.data.to
        })

        await tx.wait()
        logger.info(type + ' Transaction confirmed');

        transactionService.createTransaction(tx.hash, type, amount.toString(), price.toString())

    } catch (err) {
        console.error('Transaction error:', err);
    }

    res.end()
})

export default {
    tokenSwap
}