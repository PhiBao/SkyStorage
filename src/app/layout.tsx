import './globals.css'
import { Inter } from 'next/font/google'
import { WalletProvider } from '@/components/WalletProvider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YouTube to Shelby - Decentralized Video Storage',
  description: 'Download YouTube videos and store them on Shelby decentralized storage network',
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
