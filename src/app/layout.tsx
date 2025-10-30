import './globals.css'
import { Inter } from 'next/font/google'
import { WalletProvider } from '@/components/WalletProvider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SkyStorage - Decentralized File Storage',
  description: 'Upload and store any file on Shelby decentralized storage network with blockchain verification',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <WalletProvider>
          {children}
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  )
}
