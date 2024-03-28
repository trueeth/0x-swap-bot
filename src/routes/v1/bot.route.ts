import express from 'express';
import { ethers, parseUnits } from 'ethers'
import axios from 'axios';
import qs from 'qs'
import { TOKENS } from '../../config/tokens';

const router = express.Router();
const privateKey = '44f97a3798bd027333a38baceb9f6251c101f3215e9ab374549689b30e06491b'
const provider = new ethers.InfuraProvider('arbitrum', '68fb4cbb2848418a978fe5b0aa522812')
const wallet = new ethers.Wallet(privateKey, provider)

router
  .route('/')
  .get(async (_req, res) => {

    const query = {
      sellToken: TOKENS['usdt']?.address as string,
      buyToken: TOKENS['wsteth']?.address as string,
      sellAmount: parseUnits('1', TOKENS['usdt']?.decimals).toString(),
      takerAddress: wallet.address,
    }
    const sQuery = qs.stringify(query)
    const quote = await axios.get(
      `https://arbitrum.api.0x.org/swap/v1/quote?${sQuery}`,
      {
        headers: {
          "0x-api-key": "c9f13c84-9fcb-4f42-aa30-a11b0d016aa5",
        },
      }
    );

    try {
      const tx = await wallet.sendTransaction({
        data: quote.data.data,
        to: quote.data.to
      })

      console.log('Transaction hash:', tx.hash);
      await tx.wait()
      console.log('Transaction confirmed');

    } catch (err) {
      console.error('Transaction error:', err);
    }
    res.end()
  });


export default router;