# Deployment Guide for Render.com

## Prerequisites
1. A Render.com account
2. Your code pushed to GitHub

## Environment Variables Required

You'll need to set these environment variables in your Render service:

### Required Variables:
- `DATABASE_URL` - Your PostgreSQL connection string (you already have this from Render)
  - Example: `postgresql://user:password@host:port/database`

### Optional Variables:
- `NEXT_PUBLIC_EXTERNAL_API_URL` - Your backend API URL if different from the app
  - Example: `https://real-estate-api-7mln.onrender.com`
- `NEXT_PUBLIC_MAPBOX_TOKEN` - If you're using Mapbox for maps
- `NEXT_PUBLIC_GA_ID` - If you're using Google Analytics

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. Commit and push all changes to GitHub:
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. Go to [Render Dashboard](https://dashboard.render.com/)

3. Click "New +" and select "Blueprint"

4. Connect your GitHub repository

5. Render will automatically detect the `render.yaml` file and create the service

6. Add the environment variables in the Render dashboard

7. Deploy!

### Option 2: Using Dockerfile

1. Go to [Render Dashboard](https://dashboard.render.com/)

2. Click "New +" and select "Web Service"

3. Connect your GitHub repository

4. Choose "Docker" as the runtime

5. Set the following:
   - Name: `real-estate-aggregator`
   - Root Directory: Leave empty or set to your app directory
   - Environment: `Docker`
   - Build Command: (leave empty, uses Dockerfile)
   - Start Command: (leave empty, uses Dockerfile)

6. Add environment variables

7. Deploy!

### Option 3: Using Node.js Runtime

1. Go to [Render Dashboard](https://dashboard.render.com/)

2. Click "New +" and select "Web Service"

3. Connect your GitHub repository

4. Choose "Node" as the runtime

5. Set the following:
   - Name: `real-estate-aggregator`
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`

6. Add environment variables

7. Deploy!

## Post-Deployment

1. Your app will be available at: `https://real-estate-aggregator.onrender.com` (or your chosen subdomain)

2. The first deployment might take 10-15 minutes

3. Subsequent deployments will be faster due to caching

## Troubleshooting

### If the build fails:
1. Check the logs in Render dashboard
2. Ensure all environment variables are set correctly
3. Make sure the DATABASE_URL is accessible from Render's servers

### If you see Prisma errors:
1. Ensure `prisma generate` runs during build (already configured)
2. Check that your DATABASE_URL is correct
3. You might need to run migrations manually

### To run migrations on Render:
1. Use Render's "Shell" feature in the dashboard
2. Run: `npx prisma migrate deploy`

## Notes
- Render's free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Consider upgrading to paid tier for always-on service