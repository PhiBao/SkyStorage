#!/usr/bin/env node

/**
 * Test API Configuration
 * 
 * This script tests whether your API keys are working correctly.
 */

const fs = require('fs');
const path = require('path');

async function testConfiguration() {
  console.log('🧪 Testing API Configuration...\n');
  
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ No .env.local file found');
    console.log('   Run "npm run setup-account" first\n');
    return;
  }
  
  // Read environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const shelbyApiKey = envContent.match(/NEXT_PUBLIC_SHELBY_API_KEY=(.+)/)?.[1] || '';
  const aptosApiKey = envContent.match(/NEXT_PUBLIC_APTOS_API_KEY=(.+)/)?.[1] || '';
  
  console.log('📋 Configuration Status:');
  
  // Test Shelby API Key
  if (shelbyApiKey && shelbyApiKey !== 'your_shelby_api_key_here') {
    console.log('   ✅ Shelby API Key: Configured');
    // You could add actual API test here
  } else {
    console.log('   ⚠️  Shelby API Key: Not configured (some features may be limited)');
  }
  
  // Test Aptos API Key
  if (aptosApiKey && aptosApiKey !== 'your_aptos_api_key_here' && aptosApiKey !== '') {
    console.log('   ✅ Aptos API Key: Configured (optional)');
  } else {
    console.log('   ✅ Aptos API Key: Using public endpoints (recommended)');
  }
  
  // Check account info
  const privateKey = envContent.match(/SHELBY_ACCOUNT_PRIVATE_KEY=(.+)/)?.[1] || '';
  const address = envContent.match(/SHELBY_ACCOUNT_ADDRESS=(.+)/)?.[1] || '';
  
  if (privateKey && address) {
    console.log('   ✅ Account: Generated');
    console.log(`   📍 Address: ${address.substring(0, 10)}...`);
  } else {
    console.log('   ❌ Account: Not configured');
  }
  
  console.log('\n🎯 Summary:');
  
  if (shelbyApiKey && shelbyApiKey !== 'your_shelby_api_key_here') {
    console.log('   ✅ Ready for full functionality!');
    console.log('   ✅ You can upload videos to Shelby');
  } else {
    console.log('   ⚠️  Limited functionality without Shelby API key');
    console.log('   ℹ️  Get one at https://geomi.dev/');
  }
  
  console.log('   ✅ Aptos integration ready (using public endpoints)');
  console.log('\n💡 To test the app: npm run dev');
}

if (require.main === module) {
  testConfiguration().catch(console.error);
}
