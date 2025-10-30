"use client";

import { useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import { Header } from "@/components/Header";
import { FileUploader } from "@/components/FileUploader";
import { FileGallery } from "@/components/FileGallery";
import { BenchmarkComparison } from "@/components/BenchmarkComparison";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const { connected } = useWallet();
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshGallery((prev: number) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            SkyStorage
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Decentralized file storage on Shelby blockchain
          </p>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Connect your Petra wallet to Shelbynet
                    </p>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Upload any file: documents, images, videos, audio, and more
                    </p>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Files are stored permanently on Shelby's decentralized network
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {connected ? (
          <div className="space-y-8">
            <FileUploader onUploadSuccess={handleUploadSuccess} />
            <FileGallery refreshTrigger={refreshGallery} />
            <BenchmarkComparison />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Wallet Connection Required
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Please connect your wallet to start downloading and storing videos on Shelby.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This is a demo version. In production, you would connect a real Aptos wallet like{" "}
                  <a 
                    href="https://petra.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Petra Wallet
                  </a>
                </p>
              </div>
            </div>
            <BenchmarkComparison />
          </div>
        )}
      </main>
    </div>
  );
}
