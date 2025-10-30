import { useWallet } from '@/components/WalletProvider';
import { getShelbyClient } from '@/lib/shelby-client';
import { AccountAddress } from '@aptos-labs/ts-sdk';
import {
  ClayErasureCodingProvider,
  expectedTotalChunksets,
  generateCommitments,
  ShelbyBlobClient,
  type BlobCommitments,
} from '@shelby-protocol/sdk/browser';
import { useState, useCallback } from 'react';

interface UseUploadToShelbyReturn {
  uploadToShelby: (
    fileData: Uint8Array,
    blobName: string,
    expirationDays?: number
  ) => Promise<{
    url: string;
    transactionHash: string;
  }>;
  isUploading: boolean;
  error: string | null;
}

export const useUploadToShelby = (): UseUploadToShelbyReturn => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToShelby = useCallback(
    async (
      fileData: Uint8Array,
      blobName: string,
      expirationDays: number = 30
    ): Promise<{ url: string; transactionHash: string }> => {
      if (!account) {
        throw new Error('Wallet not connected');
      }

      setIsUploading(true);
      setError(null);

      try {
        console.log('🔧 Starting Shelby upload...');

        // Step 1: Generate erasure-coded commitments (Clay encoding)
        const commitments: BlobCommitments = await generateCommitments(
          await ClayErasureCodingProvider.create(),
          fileData
        );

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expirationDays);
        const expirationEpochMicros = Math.floor(expirationDate.getTime() * 1000);

        // Step 2: Create register blob payload
        const registerPayload = ShelbyBlobClient.createRegisterBlobPayload({
          account: AccountAddress.fromString(account),
          blobName,
          blobMerkleRoot: commitments.blob_merkle_root,
          blobSize: commitments.raw_data_size,
          expirationMicros: expirationEpochMicros,
          numChunksets: expectedTotalChunksets(commitments.raw_data_size),
        }) as any;

        // Step 3: Sign and submit transaction
        const functionArgs = registerPayload.functionArguments.map((arg: any, index: number) => {
          // The 3rd argument (index 2) is the merkle root in complex format
          if (index === 2 && arg && typeof arg === 'object' && arg.values) {
            // Convert { values: [{ value: 234 }, ...] } to [234, ...]
            return arg.values.map((v: any) => v.value);
          }
          return arg;
        });
        
        const petraTransaction = {
          type: 'entry_function_payload',
          function: registerPayload.function,
          type_arguments: [],
          arguments: functionArgs,
        };
        
        const transactionOptions = {
          max_gas_amount: '200000',
          gas_unit_price: '100',
        };
        
        let txResponse;
        try {
          txResponse = await signAndSubmitTransaction({
            ...petraTransaction,
            ...transactionOptions,
          });
          console.log('✅ Transaction submitted:', txResponse.hash);
        } catch (walletError) {
          console.error('❌ Wallet error:', walletError);
          throw new Error(`Wallet signature failed: ${walletError instanceof Error ? walletError.message : 'Unknown error'}`);
        }

        // Step 4: Upload blob data
        const shelbyClient = getShelbyClient();
        
        try {
          await shelbyClient.rpc.putBlob({
            account: AccountAddress.fromString(account),
            blobName,
            blobData: fileData,
          });

          console.log('✅ Upload complete!');
        } catch (uploadError: any) {
          console.error('❌ Shelby upload error:', uploadError);
          
          // Check if it's a server error (500) vs client error (400)
          if (uploadError?.message?.includes('500')) {
            throw new Error(
              'Shelby network is experiencing issues. Your video was registered on the blockchain, but the upload failed. ' +
              'Please try again in a few minutes. Transaction: ' + txResponse.hash
            );
          } else if (uploadError?.message?.includes('413') || uploadError?.message?.includes('too large')) {
            throw new Error(
              'File size exceeds Shelby network limits. Try a smaller video or lower quality.'
            );
          } else {
            throw new Error(
              `Upload to Shelby network failed: ${uploadError?.message || 'Unknown error'}. ` +
              `Transaction was successful: ${txResponse.hash}`
            );
          }
        }

        // Ensure account has 0x prefix for the URL
        const formattedAccount = account.startsWith('0x') ? account : `0x${account}`;
        const downloadUrl = `https://api.shelbynet.shelby.xyz/shelby/v1/blobs/${formattedAccount}/${encodeURIComponent(blobName)}`;

        return {
          url: downloadUrl,
          transactionHash: txResponse.hash,
        };
      } catch (err) {
        console.error('❌ Upload error:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [account, signAndSubmitTransaction]
  );

  return {
    uploadToShelby,
    isUploading,
    error,
  };
};
