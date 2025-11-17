# Deployment Guide - Recipe Gallery Next.js

This document outlines the steps to deploy the Recipe Gallery Next.js application.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git installed on your system
- A GitHub account
- (Optional) A Vercel account for easy deployment

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Kornform/recepie-gallery-nextjs.git
cd recepie-gallery-nextjs
```

### 2. Navigate to the App Directory

```bash
cd app
```

### 3. Install Dependencies

```bash
npm install
```

or if you're using yarn:

```bash
yarn install
```

## Development

### Running the Development Server

```bash
npm run dev
```

or with yarn:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

### Build for Production Locally

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Start Production Server Locally

```bash
npm start
```

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

Vercel is the recommended platform for Next.js applications as it's made by the same team.

#### Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import the `recepie-gallery-nextjs` repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Click "Deploy"

#### Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to app directory
cd app

# Deploy
vercel
```

### Option 2: Deploy to Netlify

1. Go to [Netlify](https://www.netlify.com)
2. Sign in and click "Add new site"
3. Import from GitHub
4. Configure build settings:
   - **Base directory**: `app`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Click "Deploy site"

### Option 3: Deploy to Custom Server

1. Build the application:
   ```bash
   cd app
   npm run build
   ```

2. Copy the following to your server:
   - `.next` folder
   - `public` folder
   - `package.json`
   - `package-lock.json`
   - `next.config.ts`

3. On your server, install dependencies and start:
   ```bash
   npm install --production
   npm start
   ```

### Option 4: Docker Deployment

Create a `Dockerfile` in the `app` directory:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Then build and run:

```bash
docker build -t recipe-gallery .
docker run -p 3000:3000 recipe-gallery
```

## Environment Variables

If you add environment variables in the future, create a `.env.local` file in the `app` directory:

```bash
# Example environment variables
NEXT_PUBLIC_API_URL=https://api.example.com
```

For production deployments, add these variables in your hosting platform's dashboard.

## Post-Deployment Checklist

- [ ] Verify all recipe images are loading correctly
- [ ] Test filtering and search functionality
- [ ] Check responsive design on mobile devices
- [ ] Verify theme variables are applied correctly
- [ ] Test performance with Lighthouse
- [ ] Set up custom domain (if applicable)
- [ ] Configure analytics (if needed)

## Troubleshooting

### Build Fails

- Ensure you're using Node.js v18 or higher
- Delete `node_modules` and `.next` folders, then run `npm install` again
- Check for TypeScript errors: `npm run build`

### Images Not Loading

- Verify images are in the `public/recipes` folder
- Check that image paths in `src/data/recipes.ts` are correct
- Ensure Next.js image optimization is configured properly

### Styling Issues

- Clear browser cache
- Check that Tailwind CSS is properly configured
- Verify theme variables in `src/app/theme-variables.tsx`

## Updating the Deployment

### For Vercel/Netlify
Simply push to your GitHub repository:

```bash
git add .
git commit -m "Your update message"
git push origin master
```

The platform will automatically rebuild and redeploy.

### For Custom Server

1. Pull the latest changes
2. Rebuild the application
3. Restart the server

```bash
git pull origin master
cd app
npm install
npm run build
# Restart your process manager (PM2, systemd, etc.)
```

## Support

For issues or questions:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review the project's GitHub Issues
- Consult the [Vercel Documentation](https://vercel.com/docs) for deployment-specific questions
