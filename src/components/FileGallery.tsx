"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/components/WalletProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Play, Clock, User, Eye } from "lucide-react";

interface VideoBlob {
  name: string;
  size: number;
  owner: string;
  expirationMicros: number;
  expirationDate: string;
  isExpired: boolean;
  downloadUrl: string;
}

interface VideoGalleryProps {
  refreshTrigger?: number;
}

export function FileGallery({ refreshTrigger }: VideoGalleryProps) {
  const { account } = useWallet();
  const [videos, setVideos] = useState<VideoBlob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [downloadStats, setDownloadStats] = useState<{
    videoName: string;
    downloadTime: number;
    fileSize: number;
    downloadSpeed: number;
  } | null>(null);

  const fetchVideos = async () => {
    if (!account) {
      setVideos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/list-videos?account=${account}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch videos");
      }

      setVideos(data.videos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [account, refreshTrigger]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const extractVideoTitle = (filename: string) => {
    // Remove file extension and try to extract meaningful title
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    // Replace underscores with spaces and clean up
    return nameWithoutExt.replace(/_/g, " ").substring(0, 80);
  };

  const getVideoId = (filename: string) => {
    // Try to extract YouTube video ID from filename
    const match = filename.match(/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (filename: string) => {
    const videoId = getVideoId(filename);
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : "/placeholder-video.jpg";
  };

  const isVideoFile = (filename: string) => {
    const videoExtensions = ['.mp4', '.webm', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.m4v', '.mpg', '.mpeg'];
    const lowerFilename = filename.toLowerCase();
    return videoExtensions.some(ext => lowerFilename.endsWith(ext));
  };

  if (!account) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Your Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Please connect your wallet to view your stored files
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Your Files on Shelby
          {videos.length > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-2 py-1 rounded-full">
              {videos.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading videos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <Button onClick={fetchVideos} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No files found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Upload some files to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: any, index: number) => (
              <div
                key={`${video.name}-${index}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Video Thumbnail */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                  <img
                    src={getThumbnailUrl(video.name)}
                    alt={extractVideoTitle(video.name)}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.currentTarget.src = "/placeholder-video.jpg";
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatFileSize(video.size)}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4 space-y-3">
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm">
                    {extractVideoTitle(video.name)}
                  </h3>

                  <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        Expires: {formatDate(video.expirationDate)}
                        {video.isExpired && (
                          <span className="text-red-500 ml-1">(Expired)</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {isVideoFile(video.name) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => setPreviewVideo(video.downloadUrl)}
                        disabled={video.isExpired}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={async () => {
                        const startTime = performance.now();
                        try {
                          const response = await fetch(video.downloadUrl);
                          if (!response.ok) throw new Error('Download failed');
                          const blob = await response.blob();
                          const endTime = performance.now();
                          const downloadTime = (endTime - startTime) / 1000;
                          const downloadSpeed = (video.size / downloadTime) / (1024 * 1024);
                          
                          setDownloadStats({
                            videoName: video.name,
                            downloadTime,
                            fileSize: video.size,
                            downloadSpeed,
                          });

                          // Trigger browser download
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = video.name;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (err) {
                          console.error('Download error:', err);
                          // Fallback to opening in new tab
                          window.open(video.downloadUrl, "_blank");
                        }
                      }}
                      disabled={video.isExpired}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(
                        `https://explorer.shelby.xyz/shelbynet/account/${video.owner}/blobs?name=${encodeURIComponent(video.name)}`,
                        "_blank"
                      )}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Video Preview Modal */}
      {previewVideo && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Video Preview</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewVideo(null)}
              >
                Close
              </Button>
            </div>
            <div className="p-4">
              <video 
                controls 
                className="w-full max-h-[70vh]"
                src={previewVideo}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Download Stats Modal */}
      {downloadStats && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setDownloadStats(null)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Download Complete!
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDownloadStats(null)}
                >
                  Close
                </Button>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Performance Metrics
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">File Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white truncate ml-2 max-w-xs">
                      {downloadStats.videoName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Download Time:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {downloadStats.downloadTime.toFixed(2)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatFileSize(downloadStats.fileSize)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-blue-200 dark:border-blue-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Download Speed:</span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        {downloadStats.downloadSpeed.toFixed(2)} MB/s
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                      ⚡ Typical AWS S3: 10-50 MB/s • Azure CDN: 20-100 MB/s
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                      📦 YouTube: 5-15 MB/s • Google Drive: 10-30 MB/s
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
