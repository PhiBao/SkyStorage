"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExternalLink, X, Wallet } from "lucide-react";

interface WalletInstallModalProps {
  onClose: () => void;
}

export function WalletInstallModal({ onClose }: WalletInstallModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            <CardTitle>Petra Wallet Required</CardTitle>
          </div>
          <CardDescription>
            You need Petra Wallet to use this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">What is Petra Wallet?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Petra is a browser extension wallet for Aptos blockchain. It allows you to:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
              <li>Manage your Aptos accounts</li>
              <li>Sign transactions securely</li>
              <li>Store and transfer tokens</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Installation Steps:</h3>
            <ol className="text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside space-y-1">
              <li>Click the button below to open Petra website</li>
              <li>Install the browser extension</li>
              <li>Create or import your wallet</li>
              <li>Return here and click "Connect Wallet" again</li>
            </ol>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>💡 Already installed?</strong> Make sure the extension is enabled in your browser's extension settings, then refresh this page.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => window.open("https://petra.app/", "_blank")}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Install Petra Wallet
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              Available for Chrome, Firefox, and other browsers
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
