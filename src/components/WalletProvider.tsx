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
  const [walletReady, setWalletReady] = useState(false);

  // Check wallet availability and connection status on mount
  useEffect(() => {
    let mounted = true;
    let checkAttempts = 0;
    const maxAttempts = 20; // Check for 2 seconds (20 * 100ms)
    
    const checkWallet = async () => {
      if (!mounted) return;
      
      if (typeof window !== 'undefined' && window.aptos) {
        setWalletReady(true);
        await checkWalletConnection();
        return true;
      }
      
      checkAttempts++;
      if (checkAttempts < maxAttempts) {
        setTimeout(checkWallet, 100);
      } else {
        console.log("Wallet not detected after 2 seconds");
        setWalletReady(true); // Still set to true so UI can show "install wallet" message
      }
      return false;
    };
    
    // Start checking immediately
    checkWallet();
    
    // Also listen for account changes
    const handleAccountChange = () => {
      if (mounted) {
        checkWalletConnection();
      }
    };
    
    window.addEventListener('accountChanged', handleAccountChange);
    
    return () => {
      mounted = false;
      window.removeEventListener('accountChanged', handleAccountChange);
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (typeof window === 'undefined') return;
      
      if (window.aptos && typeof window.aptos.isConnected === 'function') {
        const isConnected = await window.aptos.isConnected();
        if (isConnected && typeof window.aptos.account === 'function') {
          const accountInfo = await window.aptos.account();
          if (accountInfo && accountInfo.address) {
            setAccount(accountInfo.address);
            setConnected(true);
            setWalletName("Petra");
          }
        }
      }
    } catch (error) {
      console.log("Wallet check error:", error);
      // Don't set any error state, just silently fail
    }
  };

  const connect = useCallback(async () => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      console.log("Not in browser environment");
      return;
    }

    // Wait a bit if wallet is still initializing
    if (!walletReady) {
      console.log("Wallet still initializing, please wait...");
      // Wait up to 2 seconds for wallet to be ready
      for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (window.aptos) break;
      }
    }

    // Check if Petra wallet is installed
    if (!window.aptos || typeof window.aptos.connect !== 'function') {
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
  }, [walletReady]);

  const disconnect = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.aptos && typeof window.aptos.disconnect === 'function') {
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
    if (typeof window === 'undefined' || !window.aptos) {
      throw new Error('Wallet not connected');
    }
    
    // Check if wallet is on the correct network
    try {
      if (typeof window.aptos.network === 'function') {
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
