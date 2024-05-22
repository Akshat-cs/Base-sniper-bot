## Prerequisites

1. Node.js and npm installed on your system.
2. Bitquery Free Developer Account with OAuth token (follow instructions here).
3. Wallet with some Base ETH for the transaction fees.
4. Wallet should also have some WETH. I have shown the demo with 0.001 WETH. BUt you can use any other amount.

## Steps to run the bot on your Local Machine

1. `git clone https://github.com/Akshat-cs/Base-sniper-bot.git`
2. `npm install`
3. Add your `WALLET_PRIVATE_KEY` and `BITQUERY_TOKEN` in the `.env` file. To get the OAuth Token follow these instructions [here](https://docs.bitquery.io/docs/authorisation/how-to-generate/).
4. Run this command in terminal to start the script `ts-node index.ts 0.001`. Here 0.001 is the amount of WETH you are swapping for the newly created pool with Token B on Base Mainnet.
