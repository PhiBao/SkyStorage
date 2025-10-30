# SkyStorage 🌤️

A decentralized file storage platform built on Shelby Protocol. Upload any file type and store it permanently on the Aptos blockchain with erasure coding.

## 🌟 Features

- 📁 **Universal File Upload** - Support for all file types: documents, images, videos, audio, archives, and more
- 💳 **Petra Wallet Integration** - Real wallet connection with transaction signing
- 🔐 **Blockchain Storage** - Files stored on Shelby Protocol with Clay erasure coding
- 🎯 **Drag & Drop** - Easy file upload with drag-and-drop interface
- 📱 **Modern UI** - Responsive design with file preview and gallery
- 🎬 **File Management** - View, preview, and download all your uploaded files
- 🌐 **Decentralized** - Files stored across distributed Shelby network nodes
- ⏰ **Expiration Management** - Set custom expiration dates for stored files
- 📊 **Performance Benchmarking** - Real-time metrics comparing Shelby with AWS/Azure/GCP
- ⚡ **Speed Analytics** - Track upload/download speeds with detailed breakdowns

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide icons
- **Blockchain**: Aptos Shelbynet
- **Storage SDK**: @shelby-protocol/sdk with Clay erasure coding
- **Wallet**: Petra browser extension

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/PhiBao/SkyStorage.git
cd SkyStorage
npm install
```

### 2. Setup Environment

Create `.env.local`:

```env
# Shelby API Key (optional - for enhanced features)
NEXT_PUBLIC_SHELBY_API_KEY=your_shelby_api_key

# Aptos API Key (optional - uses public endpoints by default)
NEXT_PUBLIC_APTOS_API_KEY=
```

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 💡 Usage

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - **Important**: Switch Petra wallet to **Shelbynet** network
   - Approve the connection

2. **Configure Shelbynet in Petra**
   - Network Name: `Shelbynet`
   - RPC URL: `https://api.shelbynet.shelby.xyz/v1`
   - Chain ID: Check [Shelby Documentation](https://docs.shelby.xyz)

3. **Upload Files**
   - Drag & drop any file or click to browse
   - Supports all file types up to 100MB
   - Approve the blockchain transaction in Petra wallet
   - File will be encoded and uploaded to Shelby network

4. **Manage Your Files**
   - All uploaded files appear in the gallery
   - Click **Preview** to view images/videos inline
   - Click **Download** to download from Shelby network (with speed metrics)
   - Click the explorer icon to view on Shelby Explorer

5. **Performance Metrics**
   - View real-time upload/download speeds
   - Compare with AWS S3, Azure, Google Cloud
   - See detailed timing breakdowns
   - Understand trade-offs between Web2 and Web3 storage

## 📖 Supported File Types

- **Documents**: PDF, DOC, DOCX, TXT, RTF, ODT
- **Spreadsheets**: XLS, XLSX, CSV
- **Images**: JPG, PNG, GIF, WEBP, SVG, BMP
- **Videos**: MP4, AVI, MOV, WEBM, MKV, FLV
- **Audio**: MP3, WAV, OGG, FLAC, AAC
- **Archives**: ZIP, RAR, 7Z, TAR, GZ
- **Code**: JS, TS, PY, JAVA, CPP, HTML, CSS
- **Data**: JSON, XML, YAML, YML
- **And more!**

## 🏗️ How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                   File to Shelby Flow                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────────────────────┐
         │   Select/Drop File Locally             │
         │   (Any file type, up to 100MB)         │
         └────────┬───────────────────────────────┘
                  │
                  ▼
         ┌────────────────────────────────────────┐
         │   Erasure Coding (Clay)                │
         │   - Split into chunks                  │
         │   - Add redundancy                     │
         │   - Generate merkle root               │
         └────────┬───────────────────────────────┘
                  │
                  ▼
         ┌────────────────────────────────────────┐
         │   Register on Blockchain               │
         │   - Sign with Petra wallet             │
         │   - Store merkle root on-chain         │
         │   - Set expiration                     │
         └────────┬───────────────────────────────┘
                  │
                  ▼
         ┌────────────────────────────────────────┐
         │   Upload to Shelby Network             │
         │   - Distribute chunks across nodes     │
         │   - Decentralized storage              │
         └────────┬───────────────────────────────┘
                  │
                  ▼
         ┌────────────────────────────────────────┐
         │   Access Anywhere                      │
         │   - Download from any node             │
         │   - Preview in browser                 │
         │   - Verify with merkle root            │
         └────────────────────────────────────────┘
```

## 📋 Prerequisites

- **Node.js** v18 or later
- **npm** or **pnpm**
- **Petra Wallet** - Browser extension for Aptos

### Install Petra Wallet

Visit [petra.app](https://petra.app/) and install the browser extension.

## 🚀 Deployment

### Vercel / Netlify / Railway

✅ **Now works on Vercel!** Since we removed yt-dlp dependency, this app can be deployed to any platform:

```bash
# Deploy to Vercel
vercel

# Or deploy to Netlify
netlify deploy

# Or deploy to Railway
railway up
```

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment guides.

## 📊 Performance Benchmarking

SkyStorage includes comprehensive benchmarking to compare Shelby Protocol with traditional cloud providers:

### Upload Metrics
- File upload time (including erasure coding and blockchain transaction)
- Upload speed (MB/s)

### Download Metrics
- Download time from Shelby network
- Download speed (MB/s)
- Real-time comparison with AWS S3, Azure CDN, YouTube, Google Drive

### Service Comparison
View detailed comparison table showing:
- **Shelby Protocol**: Decentralized, permanent, blockchain-verified storage
- **AWS S3**: 5-25 MB/s upload, 10-50 MB/s download
- **Azure Blob**: 10-30 MB/s upload, 20-100 MB/s download
- **Google Cloud**: 15-40 MB/s upload, 25-120 MB/s download
- **Cloudflare R2**: 20-50 MB/s upload, 30-150 MB/s download

**Key Insight**: While Shelby may have higher latency due to blockchain transactions and erasure coding, it provides unique benefits: permanence, censorship resistance, and cryptographic verification that Web2 services cannot match.

See [BENCHMARKING.md](./docs/BENCHMARKING.md) for detailed documentation.

## 🔗 API Endpoints

- `GET /api/list-videos` - Query files from blockchain
- `GET /api/get-file` - Retrieve uploaded file (legacy endpoint)

## 🧪 Development

Build the application:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## 📝 Project Structure

```
SkyStorage/
├── src/
│   ├── app/                        # Next.js 14 App Router
│   │   ├── api/                    # API Routes
│   │   │   ├── get-file/           # File retrieval
│   │   │   └── list-videos/        # Query files from blockchain
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home page
│   │   └── globals.css             # Global styles
│   ├── components/                 # React Components
│   │   ├── ui/                     # UI Components (shadcn/ui)
│   │   ├── Header.tsx              # Navigation with network warning
│   │   ├── FileUploader.tsx        # File upload interface
│   │   ├── FileGallery.tsx         # File management & preview
│   │   ├── BenchmarkComparison.tsx # Performance comparison table
│   │   ├── WalletProvider.tsx      # Petra wallet integration
│   │   └── WalletInstallModal.tsx  # Wallet install prompt
│   ├── hooks/
│   │   └── useUploadToShelby.tsx   # Shelby SDK upload hook
│   └── lib/
│       ├── shelby-client.ts        # Shelby & Aptos client config
│       └── utils.ts                # Utility functions
├── docs/                           # Documentation
└── README.md                       # This file
```

## 🌐 Network Configuration

### Petra Wallet Setup for Shelbynet

1. Open Petra wallet
2. Click network dropdown
3. Select "Add Network" or "Custom Network"
4. Configure:
   - **Name**: Shelbynet
   - **RPC URL**: `https://api.shelbynet.shelby.xyz/v1`
   - **Chain ID**: (from Shelby docs)

## 🐛 Troubleshooting

### Common Issues

**Wrong network error**
- Ensure Petra wallet is on Shelbynet
- Check the RPC URL matches: `https://api.shelbynet.shelby.xyz/v1`

**File preview/download not working**
- Verify file was uploaded successfully
- Check transaction on Shelby Explorer
- Ensure blob hasn't expired

**Wallet connection issues**
- Refresh the page
- Unlock Petra wallet
- Check wallet is on Shelbynet

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Shelby Protocol](https://shelby.xyz/)
- [Shelby Documentation](https://docs.shelby.xyz/)
- [Shelby Explorer](https://explorer.shelby.xyz)
- [Aptos Network](https://aptos.dev/)
- [Petra Wallet](https://petra.app/)

## 🙏 Acknowledgments

- **Shelby Protocol** - Decentralized storage infrastructure
- **Aptos Labs** - Layer 1 blockchain platform

---

Built with ❤️ using Shelby Protocol on Aptos
