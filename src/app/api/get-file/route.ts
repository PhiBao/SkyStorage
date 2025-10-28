import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filepath = searchParams.get('filepath');

    if (!filepath) {
      return NextResponse.json(
        { error: 'Filepath is required' },
        { status: 400 }
      );
    }

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(filepath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
}
