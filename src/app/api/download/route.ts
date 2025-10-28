import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  upload_date: string;
  view_count: number;
  filesize: number;
  format: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url, quality = 'best' } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Create downloads directory if it doesn't exist
    const downloadsDir = path.join(process.cwd(), 'downloads');
    try {
      await fs.access(downloadsDir);
    } catch {
      await fs.mkdir(downloadsDir, { recursive: true });
    }

    // First, get video info without downloading
    try {
      const infoCommand = `yt-dlp --dump-json "${url}"`;
      const { stdout: infoOutput } = await execAsync(infoCommand);
      const videoInfo: VideoInfo = JSON.parse(infoOutput.trim());

      // Generate filename
      const sanitizedTitle = videoInfo.title
        .replace(/[^a-zA-Z0-9\s\-_]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 100);
      
      const filename = `${sanitizedTitle}_${videoInfo.id}.%(ext)s`;
      const outputPath = path.join(downloadsDir, filename);

      // Download the video
      const downloadCommand = `yt-dlp -f "${quality}" -o "${outputPath}" "${url}"`;
      await execAsync(downloadCommand);

      // Find the downloaded file
      const files = await fs.readdir(downloadsDir);
      const downloadedFile = files.find(file => 
        file.includes(videoInfo.id) && 
        file.includes(sanitizedTitle.substring(0, 20))
      );

      if (!downloadedFile) {
        throw new Error('Downloaded file not found');
      }

      const filePath = path.join(downloadsDir, downloadedFile);
      const stats = await fs.stat(filePath);

      return NextResponse.json({
        success: true,
        videoInfo: {
          id: videoInfo.id,
          title: videoInfo.title,
          description: videoInfo.description,
          thumbnail: videoInfo.thumbnail,
          duration: videoInfo.duration,
          uploader: videoInfo.uploader,
          upload_date: videoInfo.upload_date,
          view_count: videoInfo.view_count,
        },
        downloadInfo: {
          filename: downloadedFile,
          filepath: filePath,
          size: stats.size,
          downloadedAt: new Date().toISOString(),
        }
      });

    } catch (error) {
      console.error('yt-dlp error:', error);
      return NextResponse.json(
        { error: 'Failed to download video. Please check the URL and try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
