# SkyStorage 🌤️

A decentralized YouTube video downloader and storage platform built on Shelby Protocol. Download YouTube videos and store them permanently on the Aptos blockchain with erasure coding.

## 🌟 Features

- 🎥 **YouTube Video Download** - Download videos using yt-dlp
- 💳 **Petra Wallet Integration** - Real wallet connection with transaction signing
- 🔐 **Blockchain Storage** - Videos stored on Shelby Protocol with Clay erasure coding
- 📱 **Modern UI** - Responsive design with video preview and gallery
- 🎬 **Video Management** - View, preview, and download all your uploaded videos
- 🌐 **Decentralized** - Videos stored across distributed Shelby network nodes
- 🎯 **Clean URLs** - Automatically handles YouTube URLs with extra parameters
- ⏰ **Expiration Management** - Set custom expiration dates for stored videos

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide icons
- **Blockchain**: Aptos Shelbynet
- **Storage SDK**: @shelby-protocol/sdk with Clay erasure coding
- **Video Processing**: yt-dlp CLI tool
- **Wallet**: Petra browser extension

## 🏗️ How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                   YouTube to Shelby Flow                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   Download from YouTube│
         │   (yt-dlp)             │
         └────────┬───────────────┘
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
- **yt-dlp** - For YouTube video downloading
- **Petra Wallet** - Browser extension for Aptos

### Install yt-dlp

```bash
# Using pip
pip install yt-dlp

# Using homebrew (macOS)
brew install yt-dlp

# Using apt (Ubuntu/Debian)
sudo apt install yt-dlp
```

### Install Petra Wallet

Visit [petra.app](https://petra.app/) and install the browser extension.

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

3. **Download & Upload Video**
   - Paste a YouTube video URL
   - Click "Download & Upload to Shelby"
   - Wait for download (progress bar shows status)
   - Approve the blockchain transaction in Petra wallet
   - Video will be encoded and uploaded to Shelby network

4. **View Your Videos**
   - All uploaded videos appear in the gallery
   - Click **Preview** to watch inline
   - Click **Download** to download from Shelby network
   - Click the explorer icon to view on Shelby Explorer

## 📖 Project Structure

```
SkyStorage/
├── src/
│   ├── app/                        # Next.js 14 App Router
│   │   ├── api/                    # API Routes
│   │   │   ├── download/           # YouTube download
│   │   │   ├── get-file/           # File retrieval
│   │   │   ├── list-videos/        # Query videos from blockchain
│   │   │   └── video-info/         # Video metadata
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home page
│   │   └── globals.css             # Global styles
│   ├── components/                 # React Components
│   │   ├── ui/                     # UI Components (shadcn/ui)
│   │   ├── Header.tsx              # Navigation with network warning
│   │   ├── VideoDownloader.tsx     # Download & upload interface
│   │   ├── VideoGallery.tsx        # Video management & preview
│   │   ├── WalletProvider.tsx      # Petra wallet integration
│   │   └── WalletInstallModal.tsx  # Wallet install prompt
│   ├── hooks/
│   │   └── useUploadToShelby.tsx   # Shelby SDK upload hook
│   └── lib/
│       ├── shelby-client.ts        # Shelby & Aptos client config
│       └── utils.ts                # Utility functions
├── downloads/                      # Temporary video storage (gitignored)
├── docs/                           # Documentation
└── README.md                       # This file
```

## 🔑 Key Implementation Details

### Erasure Coding
Videos are encoded using Clay erasure coding which:
- Splits files into chunks
- Adds redundancy for fault tolerance
- Generates cryptographic commitments
- Enables recovery from partial node failures

### Blockchain Registration
Each video is registered on Aptos blockchain with:
- Blob merkle root (for verification)
- Owner address
- Expiration timestamp
- Size and metadata

### Distributed Storage
Video chunks are distributed across Shelby network:
- Multiple redundant copies
- Geographic distribution
- P2P retrieval
- Censorship resistant

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

**yt-dlp not found**
```bash
# Install globally
pip install --upgrade yt-dlp
```

**Wrong network error**
- Ensure Petra wallet is on Shelbynet
- Check the RPC URL matches: `https://api.shelbynet.shelby.xyz/v1`

**Video preview/download not working**
- Verify video was uploaded successfully
- Check transaction on Shelby Explorer
- Ensure blob hasn't expired

**Wallet connection issues**
- Refresh the page
- Unlock Petra wallet
- Check wallet is on Shelbynet

## 🔗 API Endpoints

- `POST /api/download` - Download YouTube video
- `GET /api/video-info` - Get video metadata
- `GET /api/get-file` - Retrieve downloaded file
- `GET /api/list-videos` - Query videos from blockchain

## 🧪 Development

Build the application:
```bash
npm run build
```

Start production server:
```bash
npm start
```

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
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)

## 🙏 Acknowledgments

- **Shelby Protocol** - Decentralized storage infrastructure
- **Aptos Labs** - Layer 1 blockchain platform
- **yt-dlp** - YouTube download functionality

---

Built with ❤️ using Shelby Protocol on Aptos
