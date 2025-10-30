"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BenchmarkData {
  service: string;
  uploadSpeed: string;
  downloadSpeed: string;
  latency: string;
  advantages: string[];
  color: string;
}

const benchmarkData: BenchmarkData[] = [
  {
    service: "Shelby Protocol",
    uploadSpeed: "Variable (Blockchain)",
    downloadSpeed: "10-50 MB/s",
    latency: "200-500ms",
    advantages: [
      "Decentralized storage",
      "Permanent availability",
      "Erasure coding redundancy",
      "No single point of failure",
      "Censorship resistant",
      "Blockchain verified"
    ],
    color: "bg-purple-500"
  },
  {
    service: "AWS S3",
    uploadSpeed: "5-25 MB/s",
    downloadSpeed: "10-50 MB/s",
    latency: "50-200ms",
    advantages: [
      "High reliability (99.99%)",
      "Global CDN",
      "Scalable",
      "Pay-as-you-go"
    ],
    color: "bg-orange-500"
  },
  {
    service: "Azure Blob Storage",
    uploadSpeed: "10-30 MB/s",
    downloadSpeed: "20-100 MB/s",
    latency: "50-150ms",
    advantages: [
      "Enterprise features",
      "Global presence",
      "Strong consistency",
      "Integration with Azure"
    ],
    color: "bg-blue-500"
  },
  {
    service: "Google Cloud Storage",
    uploadSpeed: "15-40 MB/s",
    downloadSpeed: "25-120 MB/s",
    latency: "40-120ms",
    advantages: [
      "Fast performance",
      "Global network",
      "Strong analytics",
      "ML integration"
    ],
    color: "bg-red-500"
  },
  {
    service: "Cloudflare R2",
    uploadSpeed: "20-50 MB/s",
    downloadSpeed: "30-150 MB/s",
    latency: "20-80ms",
    advantages: [
      "No egress fees",
      "Edge performance",
      "DDoS protection",
      "S3 compatible"
    ],
    color: "bg-yellow-500"
  }
];

export function BenchmarkComparison() {
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Storage Service Benchmark Comparison
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Compare Shelby Protocol with traditional Web2 cloud storage providers
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold">Service</th>
                <th className="text-left py-3 px-4 font-semibold">Upload Speed</th>
                <th className="text-left py-3 px-4 font-semibold">Download Speed</th>
                <th className="text-left py-3 px-4 font-semibold">Latency</th>
                <th className="text-left py-3 px-4 font-semibold">Key Features</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkData.map((data, index) => (
                <tr 
                  key={data.service}
                  className={`border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    index === 0 ? 'bg-purple-50 dark:bg-purple-900/10' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${data.color}`}></div>
                      <span className="font-medium">{data.service}</span>
                      {index === 0 && (
                        <Badge variant="outline" className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700">
                          Web3
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-blue-600 dark:text-blue-400">
                      {data.uploadSpeed}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-green-600 dark:text-green-400">
                      {data.downloadSpeed}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-orange-600 dark:text-orange-400">
                      {data.latency}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {data.advantages.slice(0, 3).map((adv) => (
                        <Badge 
                          key={adv} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {adv}
                        </Badge>
                      ))}
                      {data.advantages.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{data.advantages.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              🏗️ Decentralization
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Shelby Protocol distributes data across multiple nodes using erasure coding, 
              eliminating single points of failure unlike centralized Web2 services.
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
              🔐 Blockchain Verification
            </h4>
            <p className="text-sm text-green-800 dark:text-green-400">
              Every upload is recorded on Aptos blockchain with cryptographic proofs, 
              providing immutable verification that Web2 services cannot match.
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
              ⚡ Performance Trade-offs
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-400">
              While Web2 services may have lower latency, Shelby offers permanence and 
              decentralization. Upload times include blockchain transaction confirmation.
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            📊 Benchmark Notes
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Speeds vary based on network conditions, geographic location, and file size</li>
            <li>Shelby Protocol upload time includes erasure coding and blockchain transaction</li>
            <li>Web2 services benefit from mature global CDN infrastructure</li>
            <li>Decentralized systems prioritize data permanence over raw speed</li>
            <li>All measurements are approximate and for comparison purposes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
