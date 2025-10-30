import { NextRequest, NextResponse } from 'next/server';
import { AccountAddress, Network } from '@aptos-labs/ts-sdk';
import { ShelbyClient } from '@shelby-protocol/sdk/browser';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountAddress = searchParams.get('account');

    if (!accountAddress) {
      return NextResponse.json(
        { error: 'Account address is required' },
        { status: 400 }
      );
    }

    // Query blobs from Shelby blockchain
    const shelbyClient = new ShelbyClient({
      network: Network.SHELBYNET,
      apiKey: process.env.NEXT_PUBLIC_SHELBY_API_KEY || '',
    });

    const account = AccountAddress.fromString(accountAddress);
    const blobs = await shelbyClient.coordination.getAccountBlobs({ account });

    // Update expiration status
    const now = Date.now() * 1000; // Convert to microseconds
    const videos = blobs.map(blob => {
      const ownerAddress = blob.owner.toString();
      // Ensure address has 0x prefix
      const formattedOwner = ownerAddress.startsWith('0x') ? ownerAddress : `0x${ownerAddress}`;
      
      // The blob name might already include the account path or just be the filename
      // If it starts with @ or includes the owner address, use it as-is (just the filename part)
      let blobName = blob.name;
      
      // Remove account prefix if it exists in the blob name
      if (blobName.startsWith('@')) {
        // Extract just the filename after the account address
        const parts = blobName.split('/');
        blobName = parts[parts.length - 1]; // Get the last part (filename)
      }
      
      return {
        name: blobName,
        size: blob.size,
        owner: formattedOwner,
        expirationMicros: blob.expirationMicros,
        expirationDate: new Date(blob.expirationMicros / 1000).toISOString(),
        isExpired: blob.expirationMicros < now,
        downloadUrl: `https://api.shelbynet.shelby.xyz/shelby/v1/blobs/${formattedOwner}/${encodeURIComponent(blobName)}`,
        uploadedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      videos,
      total: videos.length,
    });

  } catch (error) {
    console.error('List videos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos from blockchain' },
      { status: 500 }
    );
  }
}
