## Prerequisites
1. Node.js and npm installed on your system.
2. Bitquery Free Developer Account with OAuth token (follow instructions here).
3. Wallet with some Base ETH for the transaction fees and WETH for the swap..

## Steps to run the bot on your Local Machine
1. `git clone https://github.com/Akshat-cs/Base-sniper-bot.git`
2. `npm install`
3. Add your `WALLET_PRIVATE_KEY` in the `.env` file
4. Add the Bearer Token in tokens.ts file in this line `Authorization: "Bearer ory..."`, you can see the instructions [here on how to get it](https://docs.bitquery.io/docs/authorisation/how-to-generate/). 
5. Run the command in terminal to start the script `ts-node index.ts 0.001`. Here 0.001 is the amount of WETH you are swapping for the new pool Token B on Base Mainnet.
