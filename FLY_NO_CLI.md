# Fly.io Deployment - Alternative Setup (No CLI Required)

Since the Fly CLI has issues on Windows, you can deploy directly from GitHub!

## Setup Steps (No Terminal Commands Needed)

### 1. Push Your Code to GitHub

Make sure all changes are committed and pushed:

```bash
git add .
git commit -m "ready for fly.io deployment"
git push
```

### 2. Set Up Fly.io (Web Dashboard)

1. Go to [fly.io](https://fly.io)
2. Sign up or log in
3. Click "Create an app"
4. Select "Deploy from a GitHub repo"
5. Choose your GitHub account and authorize Fly.io
6. Select `bvdvd-bot` repository
7. Choose app name: `bvdvd-bot`
8. Choose region: `lhr` (London)
9. Click "Create App"

### 3. Add Environment Variables

In the Fly dashboard:

1. Go to your app
2. Click "Variables" in the left sidebar
3. Add each secret (these won't be in logs):

```
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
GUILD_ID=your_discord_guild_id
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

4. Click "Add Variable" after each one

### 4. Deploy

Once variables are set, Fly will automatically:

1. Detect your repository has changed
2. Build your Docker image
3. Deploy the app
4. Start your bot

The first deploy takes ~3-5 minutes.

### 5. Monitor Your Bot

In the Fly dashboard:

1. Go to your app
2. Click "Logs" tab to see real-time logs
3. Check if your bot is connected

## If Bot Doesn't Start

1. Go to your app's "Logs" tab
2. Look for error messages
3. Check your Discord token is correct
4. Ensure GEMINI_API_KEY is set

## Update Your Bot

After making code changes:

```bash
git add .
git commit -m "your message"
git push
```

Fly will automatically redeploy within a minute!

## Manual Deployment (If Needed)

If auto-deploy doesn't work, you can manually trigger it:

1. Go to Deployments tab
2. Click "Create Deploy"
3. Choose your branch (main)
4. Click "Deploy"

## Files Already Created

- `fly.toml` - Configuration file
- `Dockerfile` - Build instructions

Everything is ready to go!
