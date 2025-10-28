# CLI Tools Guide

This document explains the relationship between the CLI tools mentioned in Shelby documentation and this web application.

## Why CLIs are mentioned in Shelby docs

The Shelby documentation mentions both Shelby CLI and Aptos CLI because:

1. **Shelby CLI** - Provides account management, network configuration, and development utilities
2. **Aptos CLI** - Manages Aptos blockchain accounts and transactions

## Do you need the CLIs for this app?

**Short answer: No, not required.**

This web application handles everything programmatically:
- Account generation and management
- Network configuration
- Transaction signing (via wallet)
- File uploads/downloads

## When you might want the CLIs

### Shelby CLI
Install if you want to:
- Manage multiple Shelby contexts
- Perform bulk operations
- Debug Shelby network issues
- Use advanced Shelby features

```bash
npm install -g @shelby-protocol/cli
shelby init
```

### Aptos CLI
Install if you want to:
- Create accounts manually
- Deploy smart contracts
- Perform low-level blockchain operations
- Debug transactions

```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
aptos init
```

## Alternative: Use our setup script

Instead of CLI tools, use our automated setup:

```bash
npm run setup-account
```

This creates everything you need without requiring CLI installation.

## CLI vs Web App Comparison

| Feature | CLI Tools | Web App | Notes |
|---------|-----------|---------|-------|
| Account Creation | ✅ | ✅ | Web app generates accounts programmatically |
| Network Config | ✅ | ✅ | Web app uses hardcoded Shelbynet config |
| File Upload | ✅ | ✅ | Web app provides UI for uploads |
| Wallet Integration | ❌ | ✅ | Web app connects to browser wallets |
| Bulk Operations | ✅ | ❌ | CLI better for automation |
| User Experience | ❌ | ✅ | Web app provides better UX |

## If you have CLI tools installed

If you already have the CLI tools, you can use them to:

1. **Create accounts with Shelby CLI**:
   ```bash
   shelby account create
   shelby context create shelbynet
   ```

2. **Export credentials for the web app**:
   ```bash
   # View your account info
   shelby account list
   
   # Copy the private key and address to .env.local
   ```

3. **Use Aptos CLI for advanced operations**:
   ```bash
   aptos account create
   aptos account fund-with-faucet
   ```

## Troubleshooting CLI Issues

### "shelby command not found"
The web app doesn't need this. If you want the CLI:
```bash
npm install -g @shelby-protocol/cli
```

### "aptos command not found"
The web app doesn't need this. If you want the CLI:
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

### Config file errors
The web app doesn't use CLI config files. Use `.env.local` instead.

## Conclusion

The CLI tools are optional development utilities. This web application provides a complete user experience without requiring any CLI installation. Use the automated setup script for the easiest getting started experience.
