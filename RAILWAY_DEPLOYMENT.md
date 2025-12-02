# Railway.app Deployment Guide for BVDVD Bot

## Step 1: Prepare Your Repository

1. Commit all changes:

   ```bash
   git add .
   git commit -m "prepare for railway deployment"
   git push
   ```

2. Ensure `.env` is in `.gitignore` (it should be):
   ```bash
   cat .gitignore  # Should contain .env
   ```

## Step 2: Set Up Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create a new project
4. Select "Deploy from GitHub repo"
5. Connect your `bvdvd-bot` repository
6. Railway will auto-detect Node.js

## Step 3: Configure Environment Variables

In the Railway dashboard:

1. Go to your project → Variables
2. Add the following environment variables:

   ```
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_client_id
   GUILD_ID=your_discord_guild_id (optional, leave blank for global commands)
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=production
   ```

3. Click "Add Variable" for each one

## Step 4: Deploy

1. Railway will automatically detect your Procfile
2. It will run: `npm run build && npm start`
3. The build step compiles TypeScript to JavaScript
4. The start step runs your bot

## Step 5: Monitor

1. Go to Deployments tab to see logs
2. Check "Runtime" logs if there are issues
3. The bot will stay online 24/7 on Railway's free tier

## Troubleshooting

**If bot doesn't start:**

- Check environment variables are set correctly
- Review deployment logs in Railway dashboard
- Ensure Discord token has correct permissions

**If commands don't register:**

- Run `npm run deploy:commands` locally with correct env vars
- Or in Railway shell, run the deploy command

**Live Logs:**

- Railway shows real-time logs in the dashboard
- Use these to debug issues

## Important Notes

- Railway provides **500 hours/month free** (enough for continuous uptime)
- Your bot will restart automatically if it crashes
- All data is persisted in Railway's environment
- Make sure your `.env` is NOT in git (it's in `.gitignore`)
