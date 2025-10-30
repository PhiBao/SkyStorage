# Benchmarking Feature

## Overview

SkyStorage now includes comprehensive benchmarking capabilities to measure and compare performance metrics between Shelby Protocol (decentralized storage) and traditional Web2 cloud providers like AWS S3, Azure Blob Storage, Google Cloud Storage, and Cloudflare R2.

## Features

### 1. Upload Performance Metrics

When uploading a video to Shelby, the app now tracks:

- **YouTube Download Time** - Time taken to download video from YouTube
- **Shelby Upload Time** - Time taken to encode, register on blockchain, and upload to Shelby network
- **Total Time** - Complete end-to-end time from URL input to blockchain confirmation
- **File Size** - Size of the uploaded video file
- **Upload Speed** - Calculated throughput in MB/s

### 2. Download Performance Metrics

When downloading a video from Shelby, the app tracks:

- **Download Time** - Time taken to retrieve video from Shelby network
- **File Size** - Size of the downloaded file
- **Download Speed** - Calculated throughput in MB/s
- **Comparison** - Real-time comparison with typical AWS S3, Azure CDN, YouTube, and Google Drive speeds

### 3. Service Comparison Table

A comprehensive comparison table showing:

| Service | Upload Speed | Download Speed | Latency | Key Features |
|---------|-------------|----------------|---------|--------------|
| Shelby Protocol | Variable | 10-50 MB/s | 200-500ms | Decentralized, Permanent, Erasure coded |
| AWS S3 | 5-25 MB/s | 10-50 MB/s | 50-200ms | High reliability, Global CDN |
| Azure Blob | 10-30 MB/s | 20-100 MB/s | 50-150ms | Enterprise features |
| Google Cloud | 15-40 MB/s | 25-120 MB/s | 40-120ms | Fast performance, ML integration |
| Cloudflare R2 | 20-50 MB/s | 30-150 MB/s | 20-80ms | No egress fees, Edge performance |

## Implementation Details

### Upload Benchmarking

Located in: `/src/components/VideoDownloader.tsx`

```typescript
const totalStartTime = performance.now();
let downloadTime = 0;
let uploadTime = 0;

// ... download logic ...
const downloadEndTime = performance.now();
downloadTime = (downloadEndTime - downloadStartTime) / 1000;

// ... upload logic ...
const uploadEndTime = performance.now();
uploadTime = (uploadEndTime - uploadStartTime) / 1000;

const totalTime = (totalEndTime - totalStartTime) / 1000;

setBenchmarkStats({
  downloadTime,
  uploadTime,
  totalTime,
  fileSize,
});
```

**Metrics Displayed:**
- YouTube download time (seconds)
- Shelby upload time (seconds)
- Total processing time (seconds)
- File size (MB)
- Upload speed (MB/s)
- Comparison with AWS S3 and Azure Blob typical speeds

### Download Benchmarking

Located in: `/src/components/VideoGallery.tsx`

```typescript
const startTime = performance.now();
const response = await fetch(video.downloadUrl);
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
```

**Metrics Displayed:**
- Download time (seconds)
- File size (MB)
- Download speed (MB/s)
- Comparison with AWS S3, Azure CDN, YouTube, and Google Drive

### Comparison Component

Located in: `/src/components/BenchmarkComparison.tsx`

A standalone component that provides:
- Service-by-service comparison table
- Visual color coding for different providers
- Web3 vs Web2 badges
- Key insights about decentralization, blockchain verification, and performance trade-offs
- Detailed notes about benchmark methodology

## User Experience

### Upload Flow

1. User pastes YouTube URL
2. App downloads video from YouTube (timer starts)
3. App displays "Downloading..." with progress
4. Video is encoded with erasure coding
5. Blockchain transaction is signed
6. Video is uploaded to Shelby network
7. **Success modal displays comprehensive metrics:**
   - YouTube download time
   - Shelby upload time
   - Total time
   - Upload speed
   - Comparison with Web2 services

### Download Flow

1. User clicks "Download" button on a video
2. App fetches video from Shelby network (timer starts)
3. Video downloads to user's computer
4. **Performance modal displays:**
   - Download time
   - File size
   - Download speed
   - Comparison with AWS, Azure, YouTube, Google Drive

### Comparison View

- Always visible at bottom of page
- Shows side-by-side comparison of all major cloud providers
- Highlights Shelby's unique Web3 advantages
- Provides context about trade-offs between speed and decentralization

## Performance Considerations

### Why Shelby May Be Slower

1. **Blockchain Transactions** - Every upload requires on-chain registration
2. **Erasure Coding** - Files are split and encoded for redundancy
3. **Decentralization** - Data is distributed across multiple nodes
4. **Network Maturity** - Shelby network is newer than established Web2 CDNs

### Why Shelby Is Worth It

1. **Permanence** - Videos stored permanently on blockchain
2. **Censorship Resistance** - No central authority can remove content
3. **Verifiability** - Cryptographic proofs on blockchain
4. **No Vendor Lock-in** - Decentralized storage owned by users
5. **Data Sovereignty** - Users control their own data

## Benchmarking Methodology

### Timing Precision

- Uses `performance.now()` for high-resolution timestamps
- Measures milliseconds and converts to seconds
- Includes all overhead (network, encoding, transaction confirmation)

### Speed Calculation

```
Upload Speed (MB/s) = File Size (bytes) / Upload Time (seconds) / 1024 / 1024
Download Speed (MB/s) = File Size (bytes) / Download Time (seconds) / 1024 / 1024
```

### Comparison Data Sources

- AWS S3: Based on AWS published performance benchmarks
- Azure Blob: Based on Azure documentation and real-world tests
- Google Cloud: Based on GCP performance documentation
- Cloudflare R2: Based on Cloudflare published benchmarks
- YouTube: Based on typical consumer download speeds
- Google Drive: Based on typical consumer download speeds

## Future Enhancements

### Planned Features

1. **Historical Tracking** - Store benchmark results in local storage
2. **Charts and Graphs** - Visualize performance over time
3. **Batch Operations** - Test multiple files and show averages
4. **Network Statistics** - Display current Shelby network health
5. **Peer Comparison** - Compare with other users' speeds
6. **Export Data** - Download benchmark results as CSV/JSON

### Advanced Metrics

1. **Time to First Byte (TTFB)** - Measure initial response latency
2. **Chunk Upload Progress** - Track individual erasure coding chunks
3. **Node Distribution** - Show which nodes store data
4. **Transaction Gas Costs** - Display blockchain fees
5. **Geographic Performance** - Measure speed by region

## Usage Examples

### Example 1: Upload a Small Video (10 MB)

```
YouTube Download Time: 2.3s
Shelby Upload Time: 8.5s
Total Time: 10.8s
Upload Speed: 1.18 MB/s

Comparison:
- AWS S3: Typical 5-25 MB/s
- Azure Blob: Typical 10-30 MB/s
```

**Analysis:** Shelby is slower due to blockchain transaction and erasure coding, but provides permanent decentralized storage.

### Example 2: Download a Medium Video (50 MB)

```
Download Time: 4.2s
File Size: 50 MB
Download Speed: 11.9 MB/s

Comparison:
- AWS S3: 10-50 MB/s
- Azure CDN: 20-100 MB/s
- YouTube: 5-15 MB/s
- Google Drive: 10-30 MB/s
```

**Analysis:** Shelby download speeds are competitive with AWS S3 and faster than typical YouTube downloads.

## Technical Architecture

### Performance Tracking Flow

```
┌─────────────────────────────────────────────────────────┐
│                 Performance Measurement                  │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
    ┌────────────────┐
    │ Start Timer    │
    │ (performance.  │
    │  now())        │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ Execute        │
    │ Operation      │
    │ (Download/     │
    │  Upload)       │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ End Timer      │
    │ (performance.  │
    │  now())        │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ Calculate      │
    │ - Duration     │
    │ - Speed        │
    │ - Comparison   │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │ Display        │
    │ Results        │
    │ in Modal       │
    └────────────────┘
```

### State Management

```typescript
// Upload Stats
const [benchmarkStats, setBenchmarkStats] = useState<{
  downloadTime?: number;
  uploadTime?: number;
  totalTime?: number;
  fileSize?: number;
} | null>(null);

// Download Stats
const [downloadStats, setDownloadStats] = useState<{
  videoName: string;
  downloadTime: number;
  fileSize: number;
  downloadSpeed: number;
} | null>(null);
```

## Accessibility

- All metrics use semantic HTML
- Color-coded for quick visual scanning
- Screen reader friendly labels
- Keyboard navigation support
- Responsive design for mobile viewing

## Browser Compatibility

- Uses `performance.now()` - supported in all modern browsers
- Fallback to `Date.now()` if needed
- Progressive enhancement approach
- Works on Chrome, Firefox, Safari, Edge

## Conclusion

The benchmarking feature provides users with transparency about Shelby Protocol's performance characteristics compared to traditional Web2 services. While decentralized storage may have higher latency due to blockchain transactions and erasure coding, the benefits of permanence, censorship resistance, and verifiability make it a compelling alternative for use cases where these properties are valuable.

---

**Note:** All benchmark numbers are approximate and will vary based on network conditions, geographic location, file size, and current blockchain congestion.
