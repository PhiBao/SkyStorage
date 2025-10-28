"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { WalletInstallModal } from "./WalletInstallModal";

// Extend window object to include aptos
declare global {
  interface Window {
    aptos?: {
      connect: () => Promise<{ address: string; publicKey: string }>;
      disconnect: () => Promise<void>;
      isConnected: () => Promise<boolean>;
      account: () => Promise<{ address: string; publicKey: string }>;
      network: () => Promise<{ name: string; url: string; chainId: string }>;
      signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
      signMessage: (message: { message: string; nonce: string }) => Promise<{ signature: string }>;
    };
    petra?: any;
    martian?: any;
  }
}

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  walletName: string | null;
  signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  account: null,
  connect: async () => {},
  disconnect: async () => {},
  walletName: null,
  signAndSubmitTransaction: async () => ({ hash: '' }),
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Check wallet availability and connection status on mount
  useEffect(() => {
    // Wait a bit for wallet extension to initialize
    const timer = setTimeout(() => {
      checkWalletConnection();
    }, 100);
    
    // Listen for wallet installation/initialization
    const handleLoad = () => {
      checkWalletConnection();
    };
    
    // Check periodically if wallet becomes available (e.g., user enables extension)
    const intervalId = setInterval(() => {
      if (typeof window.aptos !== 'undefined' && window.aptos && !connected) {
        checkWalletConnection();
      }
    }, 1000);
    
    window.addEventListener('load', handleLoad);
    
    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
      window.removeEventListener('load', handleLoad);
    };
  }, [connected]);

  const checkWalletConnection = async () => {
    try {
      if (typeof window.aptos !== 'undefined' && window.aptos) {
        const isConnected = await window.aptos.isConnected();
        if (isConnected) {
          const accountInfo = await window.aptos.account();
          setAccount(accountInfo.address);
          setConnected(true);
          setWalletName("Petra");
        }
      }
    } catch (error) {
      console.log("No wallet connected or available:", error);
    }
  };

  const connect = useCallback(async () => {
    // Check if Petra wallet is installed
    if (typeof window.aptos === 'undefined' || !window.aptos) {
      console.log("Petra wallet not detected");
      setShowInstallModal(true);
      return;
    }

    setConnecting(true);
    
    try {
      // Try to connect to wallet
      const accountInfo = await window.aptos.connect();
      
      if (accountInfo && accountInfo.address) {
        setAccount(accountInfo.address);
        setConnected(true);
        setWalletName("Petra");
        
        console.log("✅ Connected to wallet:", accountInfo.address);
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      
      if (error.code === 4001) {
        alert("❌ Connection rejected\n\nYou declined the connection request. Please try again and approve the connection.");
      } else if (error.message && error.message.includes("not installed")) {
        setShowInstallModal(true);
      } else {
        alert("❌ Failed to connect wallet\n\nError: " + (error.message || "Unknown error") + "\n\nMake sure Petra wallet is installed, unlocked, and try again.");
      }
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (typeof window.aptos !== 'undefined' && window.aptos && window.aptos.disconnect) {
        await window.aptos.disconnect();
      }
      setAccount(null);
      setConnected(false);
      setWalletName(null);
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      // Still clear local state even if disconnect fails
      setAccount(null);
      setConnected(false);
      setWalletName(null);
    }
  }, []);

  const signAndSubmitTransaction = useCallback(async (transaction: any) => {
    if (!window.aptos) {
      throw new Error('Wallet not connected');
    }
    
    // Check if wallet is on the correct network
    try {
      const network = await window.aptos.network();
      console.log('Current wallet network:', network);
      
      // Check if the network URL contains shelbynet
      const isCorrectNetwork = network && (
        network.name?.toLowerCase().includes('shelby') || 
        network.url?.toLowerCase().includes('shelbynet')
      );
      
      if (!isCorrectNetwork) {
        throw new Error(`Wrong network! Please switch your Petra wallet to Shelbynet (https://api.shelbynet.shelby.xyz/v1). Currently on: ${network?.name || network?.url || 'Unknown'}`);
      }
    } catch (netError) {
      console.warn('Could not check network:', netError);
    }
    
    console.log('🔐 Sending transaction to Petra wallet:', transaction);
    // Petra wallet expects { payload: ... } format
    const result = await window.aptos.signAndSubmitTransaction({ payload: transaction });
    return result;
  }, []);

  return (
    <WalletContext.Provider value={{ 
      connected, 
      connecting, 
      account, 
      connect, 
      disconnect, 
      walletName,
      signAndSubmitTransaction
    }}>
      {children}
      {showInstallModal && (
        <WalletInstallModal onClose={() => setShowInstallModal(false)} />
      )}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
