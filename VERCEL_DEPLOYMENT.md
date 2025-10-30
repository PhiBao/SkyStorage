# 🚀 Vercel Deployment Guide

✅ **SkyStorage is now fully compatible with Vercel!** Since we removed the yt-dlp dependency, this application can be deployed to Vercel and other serverless platforms without issues.

## Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account ([vercel.com](https://vercel.com))
- Petra wallet with Shelbynet configured

## Quick Deploy

### Option 1: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PhiBao/SkyStorage)

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set up environment variables
# - Deploy!
```

### Option 3: Git Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/SkyStorage.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your SkyStorage repo
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Environment Variables** (Optional)
   ```env
   NEXT_PUBLIC_SHELBY_API_KEY=your_shelby_api_key
   NEXT_PUBLIC_APTOS_API_KEY=your_aptos_api_key
   ```
   Note: These are optional - the app works with public endpoints

5. **Deploy** 🚀
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-project.vercel.app`

## Post-Deployment

### 1. Test the Deployment

Visit your deployed URL and verify:
- ✅ Page loads correctly
- ✅ Wallet connection works
- ✅ File upload works
- ✅ File gallery displays correctly
- ✅ Shelbynet network warning appears

### 2. Configure Custom Domain (Optional)

```bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS:
# Type: CNAME
# Name: @ or www
# Value: cname.vercel-dns.com
```

### 3. Set Up Automatic Deployments

Vercel automatically deploys when you push to your main branch:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel deploys automatically! 🎉
```

## Environment Variables

### Optional Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SHELBY_API_KEY` | Shelby API key for enhanced features | No |
| `NEXT_PUBLIC_APTOS_API_KEY` | Aptos API key for higher rate limits | No |

**Note**: All variables with `NEXT_PUBLIC_` prefix are exposed to the browser. Never put sensitive keys here.

## Vercel Configuration

### `vercel.json` (Optional)

Create this file in your project root for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SHELBY_API_KEY": "@shelby-api-key"
  }
}
```

### Custom Headers

Add to `next.config.js` for security headers:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## Performance Optimization

### Edge Runtime

API routes automatically use Edge Runtime for low latency:

```typescript
// src/app/api/list-videos/route.ts
export const runtime = 'edge'; // Already configured!
```

### Image Optimization

Vercel automatically optimizes images with Next.js Image component:

```tsx
import Image from 'next/image';

<Image 
  src={fileUrl} 
  alt="File preview" 
  width={400} 
  height={300} 
  priority 
/>
```

### Caching Strategy

Configure ISR (Incremental Static Regeneration) for file gallery:

```typescript
// In FileGallery.tsx or API route
export const revalidate = 60; // Revalidate every 60 seconds
```

## Monitoring & Analytics

### Vercel Analytics

Enable in Dashboard → Analytics:

```bash
npm install @vercel/analytics
```

Then add to `layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking

Monitor errors in Vercel Dashboard → Logs or integrate with:
- Sentry
- LogRocket  
- Datadog

## Troubleshooting

### Build Failures

**Error: "Build failed"**
```bash
# Check build logs in Vercel Dashboard
# Common fixes:
npm run build  # Test locally first
npm install    # Ensure dependencies are correct
```

**Error: "Module not found"**
```bash
# Clear build cache
vercel --force  # Force rebuild

# Or in Dashboard:
# Settings → General → Clear Build Cache
```

### Runtime Errors

**Wallet not connecting**
- Ensure Petra wallet extension is installed
- Check if wallet is on Shelbynet network
- Verify `window.aptos` is available in browser

**API routes failing**
- Check environment variables are set
- Verify API endpoints in Vercel Functions logs
- Ensure CORS headers are correct

### Performance Issues

**Slow initial load**
```bash
# Analyze bundle size
npm run build
# Check .next/static/ sizes

# Optimize with dynamic imports
const FileGallery = dynamic(() => import('@/components/FileGallery'));
```

## Alternative Platforms

While Vercel is recommended, SkyStorage also works on:

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Or connect via Git in Netlify Dashboard
```

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: `.netlify/functions`

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up

# Or connect via GitHub in Railway Dashboard
```

### Cloudflare Pages

```bash
# Connect via Git in Cloudflare Dashboard

# Build Settings:
# Framework preset: Next.js
# Build command: npx @cloudflare/next-on-pages@1
# Build output: .vercel/output/static
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use Vercel Environment Variables** - For all secrets
3. **Enable Branch Protection** - Require reviews before merge
4. **Monitor Function Logs** - Check for suspicious activity
5. **Set Rate Limits** - Protect API routes from abuse

## Cost Estimation

### Vercel Free Tier (Hobby)

- **Bandwidth**: 100 GB/month
- **Build Minutes**: 100 hours/month
- **Serverless Function Executions**: 100 GB-hours
- **Edge Middleware**: 1 million invocations

**Typical SkyStorage Usage:**
- Uploads: Client-side (no bandwidth)
- Downloads: Proxied through Shelby (minimal bandwidth)
- API calls: Minimal usage
- **Verdict**: Free tier is sufficient for most users! 🎉

### Pro Tier ($20/month)

Upgrade if you need:
- Custom domains with SSL
- Advanced analytics
- Password protection
- Larger bandwidth/usage limits

## Post-Launch Checklist

- [ ] Domain configured and SSL active
- [ ] Environment variables set
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] Petra wallet tested on production
- [ ] File upload tested on production
- [ ] File download tested on production
- [ ] Benchmarking features working
- [ ] Mobile responsive verified
- [ ] SEO meta tags added
- [ ] Social media preview working

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Shelby Docs**: [docs.shelby.xyz](https://docs.shelby.xyz)
- **Issues**: GitHub Issues for SkyStorage

---

🎉 **Congratulations!** Your SkyStorage instance is now live on Vercel!

Built with ❤️ using Next.js + Shelby Protocol
