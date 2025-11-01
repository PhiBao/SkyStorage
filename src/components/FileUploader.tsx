"use client";

import { useState, useRef } from "react";
import { useWallet } from "@/components/WalletProvider";
import { useUploadToShelby } from "@/hooks/useUploadToShelby";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X, CheckCircle, ExternalLink } from "lucide-react";

interface FileUploaderProps {
  onUploadSuccess?: () => void;
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const { account } = useWallet();
  const { uploadToShelby, isUploading } = useUploadToShelby();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expirationSelection, setExpirationSelection] = useState<string>("30");
  const [customExpiration, setCustomExpiration] = useState<number>(30);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [benchmarkStats, setBenchmarkStats] = useState<{
    uploadTime?: number;
    fileSize?: number;
    uploadSpeed?: number;
  } | null>(null);

  const handleFileSelect = (file: File) => {
    // Check file size (max 100MB for demo)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is 100MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setUploadStatus("idle");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !account) return;

    setError(null);
    setUploadStatus("uploading");
    setUploadProgress(10);
    setBenchmarkStats(null);

    const startTime = performance.now();

  try {
      // Read file as Uint8Array
      setUploadProgress(20);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      setUploadProgress(40);

      // Upload to Shelby
      // determine expiration days from selection/custom
      const expirationDays = expirationSelection === 'custom' ? Math.max(1, customExpiration) : parseInt(expirationSelection || '30', 10);

      const result = await uploadToShelby(
        fileData,
        selectedFile.name,
        expirationDays
      );

      const endTime = performance.now();
      const uploadTime = (endTime - startTime) / 1000;
      const uploadSpeed = (selectedFile.size / uploadTime) / (1024 * 1024);

      setBenchmarkStats({
        uploadTime,
        fileSize: selectedFile.size,
        uploadSpeed,
      });

      setUploadedUrl(result.url);
      setTransactionHash(result.transactionHash || null);
      setUploadProgress(100);
      setUploadStatus("success");
      onUploadSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploadStatus("error");
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setError(null);
    setUploadedUrl(null);
    setTransactionHash(null);
    setBenchmarkStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconClass = "w-12 h-12";
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return <div className={`${iconClass} bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center text-blue-600 dark:text-blue-400`}>🖼️</div>;
    }
    if (['mp4', 'avi', 'mov', 'webm', 'mkv'].includes(ext || '')) {
      return <div className={`${iconClass} bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center text-purple-600 dark:text-purple-400`}>🎬</div>;
    }
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext || '')) {
      return <div className={`${iconClass} bg-green-100 dark:bg-green-900 rounded flex items-center justify-center text-green-600 dark:text-green-400`}>🎵</div>;
    }
    if (['pdf'].includes(ext || '')) {
      return <div className={`${iconClass} bg-red-100 dark:bg-red-900 rounded flex items-center justify-center text-red-600 dark:text-red-400`}>📄</div>;
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext || '')) {
      return <div className={`${iconClass} bg-indigo-100 dark:bg-indigo-900 rounded flex items-center justify-center text-indigo-600 dark:text-indigo-400`}>📝</div>;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) {
      return <div className={`${iconClass} bg-yellow-100 dark:bg-yellow-900 rounded flex items-center justify-center text-yellow-600 dark:text-yellow-400`}>📦</div>;
    }
    return <div className={`${iconClass} bg-gray-100 dark:bg-gray-900 rounded flex items-center justify-center text-gray-600 dark:text-gray-400`}>📄</div>;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload to Shelby Blockchain
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!account && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                Wallet Required
              </h3>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
              Please connect your Petra wallet to upload files to Shelby blockchain.
            </p>
          </div>
        )}

        {uploadStatus === "idle" && (
          <>
            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drop your file here, or click to browse
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Upload any file type: documents, images, videos, audio, and more
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                Maximum file size: 100MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-input"
                disabled={!account}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={!account}
              >
                <File className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>

            {/* Selected File Preview */}
            {selectedFile && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {getFileIcon(selectedFile.name)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {selectedFile && (
              <>
                <div className="flex items-center justify-between gap-4 p-2">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Storage duration</label>
                    <select
                      value={expirationSelection}
                      onChange={(e) => setExpirationSelection(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="30">30 days (default)</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">365 days</option>
                      <option value="custom">Custom</option>
                    </select>
                    {expirationSelection === 'custom' && (
                      <input
                        type="number"
                        min={1}
                        value={customExpiration}
                        onChange={(e) => setCustomExpiration(parseInt(e.target.value || '30', 10))}
                        className="w-24 border rounded px-2 py-1 text-sm"
                        aria-label="Custom storage days"
                      />
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Storage may incur fees. You can choose how long to keep the file.
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!account || isUploading}
                  className="w-full"
                  size="lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload to Shelby"}
                </Button>
              </>
            )}
          </>
        )}

        {uploadStatus === "uploading" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {selectedFile && getFileIcon(selectedFile.name)}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{selectedFile?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedFile && formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading to Shelby blockchain...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          </div>
        )}

        {uploadStatus === "success" && selectedFile && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-800 dark:text-green-300">
                    Successfully uploaded to Shelby!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Your file has been stored on the decentralized network for {/** show chosen expiration */}
                    {(() => {
                      const days = expirationSelection === 'custom' ? Math.max(1, customExpiration) : parseInt(expirationSelection || '30', 10);
                      return `${days} day${days > 1 ? 's' : ''}`;
                    })()}.
                    Storage may incur fees and must be renewed or re-uploaded after expiration.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {getFileIcon(selectedFile.name)}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{selectedFile.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            {benchmarkStats && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Upload Time</p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {benchmarkStats.uploadTime?.toFixed(2) || 0}s
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">File Size</p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {formatFileSize(benchmarkStats.fileSize || 0)}
                    </p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                    <p className="text-gray-600 dark:text-gray-400">Upload Speed</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {benchmarkStats.uploadSpeed?.toFixed(2) || 0} MB/s
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ⚡ Typical AWS S3: 5-25 MB/s • Azure Blob: 10-30 MB/s
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Upload Another File
              </Button>
              {transactionHash && (
                <Button
                  onClick={() => window.open(`https://explorer.shelby.xyz/shelbynet/txn/${transactionHash}`, "_blank")}
                  variant="outline"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Transaction
                </Button>
              )}
            </div>
          </div>
        )}

        {uploadStatus === "error" && error && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">Upload Failed</h3>
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
