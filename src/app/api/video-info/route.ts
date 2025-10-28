import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

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

    try {
      // Get video info using yt-dlp
      const command = `yt-dlp --dump-json "${url}"`;
      const { stdout } = await execAsync(command);
      const videoInfo = JSON.parse(stdout.trim());

      // Extract relevant information
      const info = {
        id: videoInfo.id,
        title: videoInfo.title,
        description: videoInfo.description,
        thumbnail: videoInfo.thumbnail,
        duration: videoInfo.duration,
        uploader: videoInfo.uploader,
        upload_date: videoInfo.upload_date,
        view_count: videoInfo.view_count,
        formats: videoInfo.formats?.map((format: any) => ({
          format_id: format.format_id,
          ext: format.ext,
          quality: format.quality,
          filesize: format.filesize,
          format_note: format.format_note,
        })) || [],
      };

      return NextResponse.json({
        success: true,
        videoInfo: info,
      });

    } catch (error) {
      console.error('yt-dlp info error:', error);
      return NextResponse.json(
        { error: 'Failed to get video information. Please check the URL.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Video info API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
