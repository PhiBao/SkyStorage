import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { ShelbyClient } from "@shelby-protocol/sdk/browser";

// Aptos client for blockchain interactions
export const aptosClient = new Aptos(
  new AptosConfig({
    network: Network.SHELBYNET, // Use Shelbynet network
    clientConfig: {
      API_KEY: process.env.NEXT_PUBLIC_APTOS_API_KEY,
    },
  }),
);

export const getAptosClient = () => {
  return aptosClient;
};

// Real Shelby client using the official SDK
export const shelbyClient = new ShelbyClient({
  network: Network.SHELBYNET,
  apiKey: process.env.NEXT_PUBLIC_SHELBY_API_KEY || '',
});

export const getShelbyClient = () => {
  return shelbyClient;
};
