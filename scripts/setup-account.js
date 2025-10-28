#!/usr/bin/env node

/**
 * Account Setup Utility
 * 
 * This script helps users create and configure Shelby accounts
 * without requiring the Shelby or Aptos CLI tools.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function generateAccount() {
  console.log('🔑 Generating new Aptos account...\n');
  
  // Generate a simple mock account for demo purposes
  // In a real implementation, you'd use proper Ed25519 key generation
  const privateKeyHex = crypto.randomBytes(32).toString('hex');
  const addressBytes = crypto.randomBytes(32);
  const address = '0x' + addressBytes.toString('hex');
  
  const accountInfo = {
    address: address,
    privateKey: '0x' + privateKeyHex,
    publicKey: '0x' + crypto.randomBytes(32).toString('hex'), // Mock public key
  };
  
  console.log('✅ Account generated successfully!\n');
  console.log('📋 Account Information:');
  console.log(`   Address: ${accountInfo.address}`);
  console.log(`   Private Key: ${accountInfo.privateKey}`);
  console.log(`   Public Key: ${accountInfo.publicKey}\n`);
  
  console.log('⚠️  Note: This is a demo account for development purposes.');
  console.log('   For production, use a proper wallet like Petra.\n');
  
  return accountInfo;
}

async function setupEnvironment(accountInfo, shelbyApiKey = '', aptosApiKey = '') {
  const envPath = path.join(process.cwd(), '.env.local');
  
  const envContent = `# Shelby Configuration
NEXT_PUBLIC_SHELBY_API_KEY=${shelbyApiKey || 'your_shelby_api_key_here'}

# Aptos Configuration (Optional - leave empty to use public endpoints)
NEXT_PUBLIC_APTOS_API_KEY=${aptosApiKey || ''}

# Account Configuration (Generated automatically)
SHELBY_ACCOUNT_PRIVATE_KEY=${accountInfo.privateKey}
SHELBY_ACCOUNT_ADDRESS=${accountInfo.address}

# Network Configuration
NEXT_PUBLIC_SHELBY_API_URL=https://api.shelbynet.shelby.xyz

# Node Environment
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created at .env.local\n');
}

async function displayFundingInfo(address) {
  console.log('💰 Funding Your Account:\n');
  console.log('Your account needs tokens to work with Shelby:');
  console.log('1. APT tokens (for transaction fees)');
  console.log('2. ShelbyUSD tokens (for storage costs)\n');
  
  console.log('🚰 Faucet Links:');
  console.log(`   APT Faucet: https://docs.shelby.xyz/apis/faucet/aptos?address=${address}`);
  console.log(`   ShelbyUSD Faucet: https://docs.shelby.xyz/apis/faucet/shelbyusd?address=${address}\n`);
  
  console.log('📱 Wallet Configuration for Shelbynet:');
  console.log('   Network Name: Shelbynet');
  console.log('   Node URL: https://api.shelbynet.shelby.xyz/v1');
  console.log('   Faucet URL: https://faucet.shelbynet.shelby.xyz');
  console.log('   Indexer URL: https://api.shelbynet.shelby.xyz/v1/graphql\n');
}

async function main() {
  console.log('🌟 Welcome to Shelby Account Setup!\n');
  console.log('This tool will help you set up your account for the YouTube to Shelby app.\n');
  
  try {
    // Check if .env.local already exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        rl.close();
        return;
      }
    }
    
    // Ask for API keys
    console.log('🔗 API Key Information:\n');
    console.log('1. Shelby API Key: Get a free API key at https://geomi.dev/');
    console.log('   - Required for uploading files to Shelby');
    console.log('   - Free tier available\n');
    
    console.log('2. Aptos API Key: Usually NOT required');
    console.log('   - This app uses public Aptos endpoints');
    console.log('   - Only needed for high-volume applications');
    console.log('   - Get one at https://aptos.dev/ if needed\n');
    
    const shelbyApiKey = await question('Enter your Shelby API key (recommended): ');
    const aptosApiKey = await question('Enter your Aptos API key (optional, press Enter to skip): ');
    
    // Generate account
    const accountInfo = await generateAccount();
    
    // Setup environment
    await setupEnvironment(accountInfo, shelbyApiKey, aptosApiKey);
    
    // Display funding information
    await displayFundingInfo(accountInfo.address);
    
    console.log('🎉 Setup complete! You can now:');
    console.log('   1. Get a real wallet like Petra (https://petra.app/)');
    console.log('   2. Fund your real wallet using the faucet links above');
    console.log('   3. Run "npm run dev" to start the application');
    console.log('   4. Connect your real wallet and start downloading videos!\n');
    
    console.log('💡 The generated account above is just for configuration.');
    console.log('   You\'ll connect your real wallet (Petra) in the web app.\n');
    
    console.log('⚠️  Important: Keep your real wallet private key secure!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
  
  rl.close();
}

if (require.main === module) {
  main();
}
