# API Keys Guide

## Do I Need API Keys?

### Shelby API Key 🔑 **RECOMMENDED**
- **What it's for**: Uploading files to Shelby storage network
- **Required?**: Recommended for full functionality
- **Cost**: Free tier available
- **Where to get**: [Geomi.dev](https://geomi.dev/)

### Aptos API Key 🔑 **OPTIONAL**
- **What it's for**: Interacting with Aptos blockchain
- **Required?**: **NO** - This app uses public endpoints
- **Cost**: Free
- **Where to get**: [Aptos.dev](https://aptos.dev/) (if you want one)

## Quick Answer

**For this YouTube to Shelby app, you only need:**
1. ✅ **Shelby API Key** (from Geomi.dev)
2. ❌ **Aptos API Key** (not required)

## Getting Your Shelby API Key

### Step 1: Visit Geomi.dev
Go to [https://geomi.dev/](https://geomi.dev/)

### Step 2: Sign Up/Login
Create an account or log in

### Step 3: Create API Key
- Look for "API Keys" or "Shelby" section
- Create a new API key for "shelbynet"
- Copy the key

### Step 4: Use in Setup
When running `npm run setup-account`, paste your Shelby API key when prompted.

## About Aptos API Keys

### When You DON'T Need One (This App)
- ✅ Using public Aptos RPC endpoints
- ✅ Basic transaction sending
- ✅ Reading blockchain data
- ✅ Wallet-based applications (like ours)

### When You MIGHT Need One
- 🔧 High-volume applications (1000+ requests/minute)
- 🔧 Enterprise applications
- 🔧 Custom indexing
- 🔧 Advanced analytics

### How to Get One (If Needed)
1. Go to [https://aptos.dev/](https://aptos.dev/)
2. Sign up for an account
3. Navigate to API section
4. Create a new API key
5. Copy the key

## Configuration Examples

### With Shelby API Key Only (Recommended)
```env
NEXT_PUBLIC_SHELBY_API_KEY=shelby_your_api_key_here
NEXT_PUBLIC_APTOS_API_KEY=
```

### With Both API Keys
```env
NEXT_PUBLIC_SHELBY_API_KEY=shelby_your_api_key_here
NEXT_PUBLIC_APTOS_API_KEY=aptos_your_api_key_here
```

### Testing Without Any API Keys
```env
NEXT_PUBLIC_SHELBY_API_KEY=
NEXT_PUBLIC_APTOS_API_KEY=
```
> Note: Some features may be limited without the Shelby API key

## Rate Limits

### Public Endpoints (No API Key)
- **Aptos**: ~100 requests/minute per IP
- **Shelby**: Limited functionality

### With API Keys
- **Shelby**: Based on your plan (free tier available)
- **Aptos**: Much higher limits

## Troubleshooting

### "Failed to upload to Shelby"
- ❌ Missing or invalid Shelby API key
- ✅ Get a key from [Geomi.dev](https://geomi.dev/)

### "Aptos connection failed"
- ✅ This app doesn't require Aptos API key
- ✅ Uses public endpoints automatically
- ✅ Check your internet connection

### "API key invalid"
- ❌ Check if you copied the key correctly
- ❌ Check if the key is for the right network (shelbynet)
- ✅ Generate a new key if needed

## Summary

**For the YouTube to Shelby app:**
1. **Get a Shelby API key** from Geomi.dev (recommended)
2. **Skip the Aptos API key** (not needed)
3. **Run the setup script** and enjoy!

The app will work with just a Shelby API key, and you can always add an Aptos API key later if you need higher rate limits.
