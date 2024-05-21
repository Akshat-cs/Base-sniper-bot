import { Percent } from "@uniswap/sdk-core";
import { ethers, providers, Wallet } from "ethers";
import { config as loadEnvironmentVariables } from "dotenv";

loadEnvironmentVariables();

export const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";
export const SWAP_ROUTER_ADDRESS = process.env.SWAP_ROUTER_ADDRESS || "";

export const INFURA_ID = process.env.INFURA_ID;
export const CHAIN_ID = parseInt(process.env.CHAIN_ID || "1");

export const DEADLINE = Math.floor(
  (Date.now() / 1000) * (parseInt(process.env.DEADLINE_IN_MINUTES || "30") * 60)
);

export const SLIPPAGE_TOLERANCE = new Percent(
  process.env.SLIPPAGE_TOLERANCE || 5,
  100
);

const RPC = process.env.RPC;
export const provider = ethers.providers.getDefaultProvider(RPC);

export const signer = new Wallet(WALLET_PRIVATE_KEY, provider);
