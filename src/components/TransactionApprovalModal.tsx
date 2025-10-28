"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";

interface TransactionApprovalModalProps {
  onApprove: () => void;
  onReject: () => void;
  videoName: string;
  videoSize: string;
}

export function TransactionApprovalModal({
  onApprove,
  onReject,
  videoName,
  videoSize,
}: TransactionApprovalModalProps) {
  const [approving, setApproving] = useState(false);

  const handleApprove = async () => {
    setApproving(true);
    // Simulate transaction signing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onApprove();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-2 border-blue-500 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-xl">🦊</span>
            </div>
            <CardTitle>Petra Wallet</CardTitle>
          </div>
          <p className="text-sm opacity-90 mt-2">Transaction Request</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Upload Video to Shelby</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  This will upload your video to decentralized storage
                </p>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">File:</span>
                <span className="font-medium truncate ml-2">{videoName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Size:</span>
                <span className="font-medium">{videoSize}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                <span className="font-medium">30 days</span>
              </div>
            </div>

            <div className="space-y-2 p-3 border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Gas Fee:</span>
                <span className="font-medium">~0.001 APT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Storage Fee:</span>
                <span className="font-medium">~2.5 ShelbyUSD</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-2">
                <span>Total:</span>
                <span>~0.001 APT + 2.5 ShelbyUSD</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={onReject}
              variant="outline"
              className="flex-1"
              disabled={approving}
            >
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={approving}
            >
              {approving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            {approving ? "Processing transaction..." : "Only approve if you trust this site"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
