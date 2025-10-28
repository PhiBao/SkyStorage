"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download, Clock, HardDrive, Calendar, User } from "lucide-react";

interface VideoDetailsProps {
  video: {
    name: string;
    size: number;
    owner: string;
    expirationMicros: number;
    expirationDate: string;
    isExpired: boolean;
    downloadUrl: string;
  };
  onClose: () => void;
}

export function VideoDetails({ video, onClose }: VideoDetailsProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const extractVideoTitle = (filename: string) => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    return nameWithoutExt.replace(/_/g, " ");
  };

  const getVideoId = (filename: string) => {
    const match = filename.match(/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (filename: string) => {
    const videoId = getVideoId(filename);
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "/placeholder-video.jpg";
  };

  const daysUntilExpiration = () => {
    const now = new Date();
    const expiration = new Date(video.expirationDate);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const videoId = getVideoId(video.name);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Video Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Video Preview */}
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={getThumbnailUrl(video.name)}
              alt={extractVideoTitle(video.name)}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-video.jpg";
              }}
            />
          </div>

          {/* Video Title */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {extractVideoTitle(video.name)}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {video.name}
            </p>
          </div>

          {/* Status and Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
                <span className="text-sm font-medium">{formatFileSize(video.size)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <Badge variant={video.isExpired ? "destructive" : "default"}>
                  {video.isExpired ? "Expired" : `${daysUntilExpiration()} days left`}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Expires:</span>
                <span className="text-sm font-medium">{formatDate(video.expirationDate)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Owner:</span>
                <span className="text-sm font-mono">
                  {`${video.owner.slice(0, 6)}...${video.owner.slice(-4)}`}
                </span>
              </div>
            </div>
          </div>

          {/* YouTube Link */}
          {videoId && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Original YouTube Video
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Watch
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              className="flex-1"
              onClick={() => window.open(video.downloadUrl, "_blank")}
              disabled={video.isExpired}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(
                `https://explorer.shelby.xyz/shelbynet/account/${video.owner}/blobs?name=${encodeURIComponent(video.name)}`,
                "_blank"
              )}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
