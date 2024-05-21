import { BigNumber, ethers } from "ethers";
import { AlphaRouter, SwapType, SwapRoute } from "@uniswap/smart-order-router";
import { CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import type { TransactionRequest } from "@ethersproject/abstract-provider";
import { getTokens } from "./tokens";
import {
  provider,
  signer,
  CHAIN_ID,
  SWAP_ROUTER_ADDRESS,
  SLIPPAGE_TOLERANCE,
  DEADLINE,
} from "./config";

const main = async () => {
  // Wait for the getTokens function to resolve
  const { Token0, Token1 } = await getTokens();

  // Ensure tokens are not null
  if (!Token0 || !Token1) {
    throw new Error("Tokens are not initialized.");
  }

  const tokenFrom = Token0.token;
  const tokenFromContract = Token0.contract;
  const tokenTo = Token1.token;

  if (typeof process.argv[2] === "undefined") {
    throw new Error(`Pass in the amount of ${tokenFrom.symbol} to swap.`);
  }

  const walletAddress = await signer.getAddress();
  const amountIn = ethers.utils.parseUnits(process.argv[2], tokenFrom.decimals);
  const balance = await tokenFromContract.balanceOf(walletAddress);

  if (!(await Token0.walletHas(signer, amountIn))) {
    throw new Error(
      `Not enough ${tokenFrom.symbol}. Needs ${amountIn}, but balance is ${balance}.`
    );
  }

  const router = new AlphaRouter({ chainId: CHAIN_ID, provider });
  const route = await router.route(
    CurrencyAmount.fromRawAmount(tokenFrom, amountIn.toString()),
    tokenTo,
    TradeType.EXACT_INPUT,
    {
      recipient: walletAddress,
      slippageTolerance: SLIPPAGE_TOLERANCE,
      deadline: DEADLINE,
      type: SwapType.SWAP_ROUTER_02,
    }
  );

  if (!route) {
    throw new Error("No route found for the swap.");
  }

  console.log(
    `Swapping ${amountIn} ${tokenFrom.symbol} for ${route.quote.toFixed(
      tokenTo.decimals
    )} ${tokenTo.symbol}.`
  );

  const allowance: BigNumber = await tokenFromContract.allowance(
    walletAddress,
    SWAP_ROUTER_ADDRESS
  );

  const buildSwapTransaction = (
    walletAddress: string,
    routerAddress: string,
    route: SwapRoute
  ): TransactionRequest => {
    return {
      data: route.methodParameters?.calldata,
      to: routerAddress,
      value: BigNumber.from(route.methodParameters?.value),
      from: walletAddress,
      gasLimit: BigNumber.from("2000000"), // Set your desired gas limit here
      // Optionally, you can specify gasPrice here if needed
      // gasPrice: YOUR_GAS_PRICE_IN_WEI
    };
  };

  const swapTransaction = buildSwapTransaction(
    walletAddress,
    SWAP_ROUTER_ADDRESS,
    route
  );

  const attemptSwapTransaction = async (
    signer: ethers.Wallet,
    transaction: TransactionRequest
  ) => {
    const signerBalance = await signer.getBalance();

    if (!signerBalance.gte(transaction.gasLimit || "0")) {
      throw new Error(`Not enough ETH to cover gas: ${transaction.gasLimit}`);
    }

    // Send the transaction with the specified gas-related parameters
    signer.sendTransaction(transaction).then((tx) => {
      tx.wait().then((receipt) => {
        console.log("Completed swap transaction:", receipt.transactionHash);
      });
    });
  };

  if (allowance.lt(amountIn)) {
    console.log(`Requesting ${tokenFrom.symbol} approval…`);

    const approvalTx = await tokenFromContract
      .connect(signer)
      .approve(
        SWAP_ROUTER_ADDRESS,
        ethers.utils.parseUnits(amountIn.mul(1000).toString(), 18)
      );

    approvalTx.wait(3).then(() => {
      attemptSwapTransaction(signer, swapTransaction);
    });
  } else {
    console.log(
      `Sufficient ${tokenFrom.symbol} allowance, no need for approval.`
    );
    attemptSwapTransaction(signer, swapTransaction);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
