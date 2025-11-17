# Static Deployment Guide

This guide explains how to convert the Recipe Gallery Next.js application from a server-side app to a fully static site that can be deployed anywhere without requiring a Node.js server.

## Why Convert to Static?

**Current Setup (Server-Side)**:
- Requires Node.js runtime
- Uses filesystem APIs (`fs.readdirSync`) to scan recipe images at runtime
- Must be deployed to platforms that support Node.js (Vercel, your own server, etc.)

**Static Setup**:
- Pure HTML, CSS, and JavaScript files
- No server required
- Can be deployed to simple static hosting (GitHub Pages, Netlify, any web server)
- Faster and cheaper to host
- Better for CDN distribution

## What Needs to Change

The main issue is in `app/src/data/recipes.ts` which uses Node.js filesystem APIs:

```typescript
// Current (Server-Side)
import fs from "node:fs";
const recipes = fs.readdirSync(recipesDir); // ❌ Requires Node.js
```

We need to change this to use a pre-generated static data file:

```typescript
// Static Version
import recipesData from "./recipes.json"; // ✅ Works in static builds
```

## Step-by-Step Conversion

### Step 1: Create a Build Script

Create a new file `app/scripts/generate-recipes.js`:

```javascript
const fs = require('fs');
const path = require('path');

const recipesDir = path.join(__dirname, '..', 'public', 'recipes');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'recipes.json');

const featuredImages = new Set([
  "rezept-bang-bang-chicken-13x18cm.png",
  "rezept-kung-pao-chicken-13x18cm.png",
  "rezept-dijon-dill-panko-salmon-13x18cm.png",
  "rezept-american-pancake-13x18cm.png",
]);

const keywordTagMap = [
  ["chicken", "chicken"],
  ["salmon", "salmon"],
  ["noodle", "noodles"],
  ["sauce", "sauce"],
  ["waffel", "waffle"],
  ["waffle", "waffle"],
  ["granola", "granola"],
  ["flapjack", "sweet"],
  ["cookie", "sweet"],
  ["porridge", "sweet"],
  ["bar", "snack"],
  ["steak", "protein"],
  ["burger", "protein"],
  ["shawarma", "protein"],
  ["soup", "basics"],
  ["marinad", "sauce"],
];

const prettifyTitle = (fileName) =>
  fileName
    .replace(/^rezept[-_]?/i, "")
    .replace(/-13x18cm|\.png|\.jpg|\.jpeg/gi, "")
    .replace(/[-_.]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const deriveTags = (fileName) => {
  const base = new Set();
  const normalized = fileName.toLowerCase();

  keywordTagMap.forEach(([keyword, tag]) => {
    if (normalized.includes(keyword)) {
      base.add(tag);
    }
  });

  if (normalized.includes("chicken") || normalized.includes("huhn")) {
    base.add("chicken");
  }

  if (normalized.includes("lachs") || normalized.includes("salmon")) {
    base.add("salmon");
  }

  if (!base.size) {
    base.add("basics");
  }

  return Array.from(base);
};

// Generate recipes data
const recipes = fs
  .readdirSync(recipesDir)
  .filter((file) => file.endsWith(".png") || file.endsWith(".jpg"))
  .map((file) => {
    const title = prettifyTitle(file);
    return {
      id: title.toLowerCase().replace(/\s+/g, "-"),
      title,
      image: `/recipes/${file}`,
      tags: deriveTags(file),
      featured: featuredImages.has(file),
      prepTime: "~15 min",
      moodNote: "Add your personal notes here soon.",
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(recipes, null, 2));

console.log(`✅ Generated ${recipes.length} recipes → ${outputFile}`);
```

### Step 2: Update package.json

Add the script to `app/package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "node scripts/generate-recipes.js",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "generate-recipes": "node scripts/generate-recipes.js"
  }
}
```

The `prebuild` script automatically runs before `build`, ensuring recipes are always up to date.

### Step 3: Update next.config.ts

Enable static export in `app/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // ← Add this line
  images: {
    unoptimized: true,  // Required for static export
  },
};

export default nextConfig;
```

**Important**: Static exports cannot use Next.js Image Optimization, so we set `unoptimized: true`.

### Step 4: Replace recipes.ts

Replace the content of `app/src/data/recipes.ts`:

```typescript
import type { RecipeMeta } from "@/types/recipes";
import recipesData from "./recipes.json";

export const getRecipes = (): RecipeMeta[] => {
  return recipesData as RecipeMeta[];
};
```

### Step 5: Create Initial recipes.json

Run the generation script once:

```bash
cd app
npm run generate-recipes
```

This creates `app/src/data/recipes.json` with all your recipe data.

### Step 6: Update .gitignore (Optional)

If you want to regenerate `recipes.json` on every build, add it to `.gitignore`:

```
# Auto-generated files
src/data/recipes.json
```

Or keep it in git if you want to commit the generated data.

### Step 7: Test the Static Build

```bash
cd app
npm run build
```

This will:
1. Run `generate-recipes.js` (via `prebuild`)
2. Build the app as static files
3. Output to `app/out/` directory

### Step 8: Test Locally

Serve the static files locally to test:

```bash
# Option 1: Using npx
npx serve out

# Option 2: Using Python
cd out
python -m http.server 8000

# Option 3: Using Node.js http-server
npx http-server out
```

Visit `http://localhost:8000` (or the port shown) to verify everything works.

## Deployment Options for Static Sites

### Option 1: GitHub Pages

1. Build the static site:
   ```bash
   cd app
   npm run build
   ```

2. The `out/` folder contains your static site

3. Deploy to GitHub Pages:
   ```bash
   # From the app directory
   git add out -f  # Force add if out/ is in .gitignore
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix app/out origin gh-pages
   ```

4. Enable GitHub Pages in repository settings → Pages → Source: gh-pages branch

### Option 2: Netlify

1. Build the app:
   ```bash
   cd app
   npm run build
   ```

2. Deploy via Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=out
   ```

Or use Netlify's web interface:
- Drag and drop the `out/` folder

Build settings for Netlify:
- **Base directory**: `app`
- **Build command**: `npm run build`
- **Publish directory**: `app/out`

### Option 3: Vercel (Static)

Even though Vercel supports Node.js, you can deploy as static:

```bash
cd app
npm run build
vercel --prod ./out
```

Or via Vercel dashboard with these settings:
- **Framework Preset**: Next.js
- **Root Directory**: `app`
- **Build Command**: `npm run build`
- **Output Directory**: `out`

### Option 4: Your Own Server

Simply upload the contents of `app/out/` to any web server:

```bash
# Using SCP
scp -r app/out/* user@yourserver.com:/var/www/html/

# Using RSYNC
rsync -avz app/out/ user@yourserver.com:/var/www/html/
```

Configure your web server (Apache, Nginx, etc.) to serve the files.

#### Nginx Configuration Example:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache Configuration Example (.htaccess):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Option 5: AWS S3 + CloudFront

1. Create an S3 bucket
2. Enable static website hosting
3. Upload the `out/` folder contents
4. (Optional) Add CloudFront for CDN

```bash
# Using AWS CLI
aws s3 sync app/out/ s3://your-bucket-name/ --delete
```

## Adding New Recipes

### After Initial Setup

When you add new recipe images to `public/recipes/`:

1. Regenerate the recipes data:
   ```bash
   cd app
   npm run generate-recipes
   ```

2. Rebuild the static site:
   ```bash
   npm run build
   ```

3. Deploy the new `out/` folder to your hosting

### Automated Deployment

You can automate this with GitHub Actions:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Static Site

on:
  push:
    branches: [master]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd app
          npm ci

      - name: Build static site
        run: |
          cd app
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./app/out
```

## Limitations of Static Export

### What You Lose:

1. **Image Optimization**: Next.js Image component requires a server
   - Solution: Set `unoptimized: true` (images served as-is)

2. **Dynamic Routes**: No ISR or SSR
   - Not an issue for this app (single page)

3. **API Routes**: Cannot use `/api/*` endpoints
   - Not used in this app

4. **Server Actions**: Cannot use server-side functions
   - Not used in this app

### What Still Works:

- ✅ Client-side JavaScript (React, interactivity)
- ✅ CSS and styling
- ✅ Client-side routing
- ✅ All your filtering and search functionality
- ✅ Image lightbox modal

## Troubleshooting

### Issue: "fs is not defined" error

**Cause**: Still using Node.js APIs in client code

**Solution**: Make sure you've replaced `recipes.ts` with the static version and generated `recipes.json`

### Issue: Images not loading

**Cause**: Incorrect base path or image paths

**Solution**:
- Verify `recipes.json` has correct paths like `/recipes/filename.png`
- Check that images are in `public/recipes/`
- For subdirectory deployments, add `basePath` to `next.config.ts`

### Issue: 404 errors on your server

**Cause**: Server not configured for single-page apps

**Solution**: Configure your server to always serve `index.html` (see server configs above)

### Issue: Build fails

**Cause**: Script can't find recipes folder

**Solution**:
- Verify `public/recipes/` exists
- Check that the path in `generate-recipes.js` is correct
- Run `npm run generate-recipes` manually to debug

## Comparing Deployment Methods

| Feature | Server-Side (Current) | Static Export |
|---------|----------------------|---------------|
| Hosting Options | Limited (need Node.js) | Any web server |
| Cost | Higher | Lower/Free |
| Speed | Good | Excellent |
| Setup Complexity | Medium | Low |
| Image Optimization | Yes | No |
| Adding Recipes | Auto-scanned | Run build script |

## Recommendation

**For your use case (recipe gallery)**, static export is ideal because:
- ✅ All data is known at build time
- ✅ No dynamic server features needed
- ✅ Cheaper and simpler hosting
- ✅ Can deploy to your own server easily
- ✅ Better performance (served from CDN)

The only extra step is running `npm run generate-recipes` when adding new recipes, which can be automated.

## Quick Start (TL;DR)

```bash
# 1. Create the build script
mkdir -p app/scripts
# (Copy generate-recipes.js from Step 1)

# 2. Update package.json scripts
# (Add prebuild and generate-recipes scripts)

# 3. Update next.config.ts
# (Add output: 'export' and images.unoptimized)

# 4. Replace recipes.ts
# (Use static import version)

# 5. Generate and build
cd app
npm run generate-recipes
npm run build

# 6. Test locally
npx serve out

# 7. Deploy
# Upload the 'out/' folder to your server
```

## Next Steps

After conversion, update `DEPLOY.md` to reflect the new static deployment process, or keep both options documented for flexibility.
