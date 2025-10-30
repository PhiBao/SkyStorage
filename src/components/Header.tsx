"use client";

import { useWallet } from "@/components/WalletProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export function Header() {
  const { connected, connecting, account, connect, disconnect, walletName } = useWallet();
  const [networkWarning, setNetworkWarning] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      if (connected && typeof window !== 'undefined' && window.aptos) {
        try {
          const network = await window.aptos.network();
          // Check both network name and URL
          const isShelbynet = network?.name?.toLowerCase().includes('shelby') || 
                             network?.url?.toLowerCase().includes('shelbynet');
          setNetworkWarning(!isShelbynet);
          
          if (!isShelbynet) {
            console.warn('⚠️ Wrong network detected:', network);
          }
        } catch (error) {
          console.error('Failed to check network:', error);
        }
      }
    };
    
    checkNetwork();
  }, [connected]);

  const onMintShelbyUsd = () => {
    if (!account) {
      return;
    }
    window.open(
      `https://docs.shelby.xyz/apis/faucet/shelbyusd?address=${account}`,
      "_blank",
    );
  };

  const onMintApt = () => {
    if (!account) {
      return;
    }
    window.open(
      `https://docs.shelby.xyz/apis/faucet/aptos?address=${account}`,
      "_blank",
    );
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SkyStorage</h1>
              <p className="text-sm text-gray-600">YouTube to Shelby Storage</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {networkWarning && connected && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2 flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-yellow-800">
                  ⚠️ Please switch to Shelbynet network
                </span>
              </div>
            )}
            
            {!connected ? (
              <Button 
                onClick={connect}
                disabled={connecting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <div>
                        <p className="text-xs text-gray-500">Connected with {walletName}</p>
                        <p className="text-sm font-mono font-medium text-gray-900">
                          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button
                  variant="outline"
                  onClick={onMintShelbyUsd}
                  className="text-sm"
                >
                  Mint ShelbyUSD
                </Button>
                
                <Button
                  variant="outline"
                  onClick={onMintApt}
                  className="text-sm"
                >
                  Mint APT
                </Button>
                
                <Button 
                  onClick={disconnect}
                  variant="outline"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
