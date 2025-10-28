"use client";

import { useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import { useUploadToShelby } from "@/hooks/useUploadToShelby";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, ExternalLink } from "lucide-react";

interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  upload_date: string;
  view_count: number;
}

interface DownloadInfo {
  filename: string;
  filepath: string;
  size: number;
  downloadedAt: string;
}

interface VideoDownloaderProps {
  onUploadSuccess?: () => void;
}

export function VideoDownloader({ onUploadSuccess }: VideoDownloaderProps) {
  const { account } = useWallet();
  const { uploadToShelby, isUploading: isUploadingToShelby } = useUploadToShelby();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"input" | "downloading" | "uploading" | "success">("input");
  const [progress, setProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  // Extract clean video ID from YouTube URL (remove extra query params)
  const cleanYouTubeUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      
      // For youtube.com/watch?v=VIDEO_ID
      if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/watch?v=${videoId}`;
        }
      }
      
      // For youtu.be/VIDEO_ID
      if (urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.pathname.slice(1).split('?')[0];
        if (videoId) {
          return `https://www.youtube.com/watch?v=${videoId}`;
        }
      }
      
      return url; // Return original if can't parse
    } catch (e) {
      return url; // Return original if invalid URL
    }
  };

  const handleDownload = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    // Clean the URL to remove extra parameters
    const cleanedUrl = cleanYouTubeUrl(url);

    setError(null);
    setIsLoading(true);
    setStep("downloading");
    setProgress(10);

    try {
      // First get video info
      const infoResponse = await fetch("/api/video-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanedUrl }),
      });

      const infoData = await infoResponse.json();
      
      if (!infoResponse.ok) {
        throw new Error(infoData.error || "Failed to get video info");
      }

      setVideoInfo(infoData.videoInfo);
      setProgress(30);

      // Download the video
      const downloadResponse = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanedUrl, quality: "best" }),
      });

      const downloadData = await downloadResponse.json();
      
      if (!downloadResponse.ok) {
        throw new Error(downloadData.error || "Failed to download video");
      }

      setDownloadInfo(downloadData.downloadInfo);
      setProgress(70);
      
      // Now upload directly to Shelby with real blockchain transaction
      setStep("uploading");
      
      // Read the file from the API
      const fileResponse = await fetch(`/api/get-file?filepath=${encodeURIComponent(downloadData.downloadInfo.filepath)}`);
      if (!fileResponse.ok) {
        throw new Error("Failed to read downloaded file");
      }
      
      // Get the file as ArrayBuffer (browser-compatible)
      const fileArrayBuffer = await fileResponse.arrayBuffer();
      const fileData = new Uint8Array(fileArrayBuffer);
      
      // Upload using real Shelby SDK
      const uploadResult = await uploadToShelby(
        fileData,
        downloadData.downloadInfo.filename,
        30 // 30 days expiration
      );
      
      setUploadedUrl(uploadResult.url);
      setTransactionHash(uploadResult.transactionHash || null);

      setProgress(100);
      setStep("success");
      onUploadSuccess?.();

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("input");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setStep("input");
    setProgress(0);
    setVideoInfo(null);
    setDownloadInfo(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          YouTube Video Downloader
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
              Please connect your Petra wallet to download and store videos on Shelby. 
              <br />
              You can import your private key from the setup process.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              onClick={() => window.open('https://petra.app/', '_blank')}
            >
              Get Petra Wallet
            </Button>
          </div>
        )}
        
        {step === "input" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="youtube-url" className="text-sm font-medium">
                YouTube URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleDownload}
                  disabled={isLoading || !url.trim()}
                  className="px-6"
                >
                  {isLoading ? "Processing..." : "Download"}
                </Button>
              </div>
            </div>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>
        )}

        {(step === "downloading" || step === "uploading") && (
          <div className="space-y-4">
            {videoInfo && (
              <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-24 h-18 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2">{videoInfo.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{videoInfo.uploader}</p>
                  <p className="text-xs text-gray-500">
                    {formatDuration(videoInfo.duration)} • {videoInfo.view_count?.toLocaleString()} views
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {step === "downloading" ? "Downloading video..." : "Uploading to Shelby..."}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </div>
        )}

        {step === "success" && videoInfo && downloadInfo && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Upload className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-800 dark:text-green-300">
                    Successfully uploaded to Shelby!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Your video has been stored on the decentralized network and will be available for 30 days.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-32 h-24 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium line-clamp-2">{videoInfo.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{videoInfo.uploader}</p>
                <p className="text-sm text-gray-500">
                  {formatDuration(videoInfo.duration)} • {formatFileSize(downloadInfo.size)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Stored locally as: {downloadInfo.filename}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  ⚠️ Not on Shelby blockchain yet - Shelby SDK integration pending
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Download Another Video
              </Button>
              <Button
                onClick={() => window.open("https://explorer.shelby.xyz/shelbynet", "_blank")}
                variant="outline"
                size="sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
