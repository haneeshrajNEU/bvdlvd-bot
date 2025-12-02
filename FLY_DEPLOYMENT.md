# Fly.io Deployment Guide for BVDVD Bot

## Prerequisites

1. Install Fly CLI:

   ```bash
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh

   # Windows (PowerShell)
   pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. Sign up at [fly.io](https://fly.io) and authenticate:
   ```bash
   flyctl auth signup
   # or
   flyctl auth login
   ```

## Step 1: Initialize Fly.io App

```bash
cd d:/2025/Web\ dev/bvdvd-bot
flyctl launch
```

When prompted:

- **App Name:** `bvdvd-bot` (or choose your own)
- **Region:** `lhr` (London - closest to UK)
- **Postgres/Redis:** `n` (you don't need a database)

This creates/updates `fly.toml` and `.dockerignore`

## Step 2: Set Environment Variables

```bash
flyctl secrets set DISCORD_TOKEN=your_token
flyctl secrets set CLIENT_ID=your_client_id
flyctl secrets set GUILD_ID=your_guild_id
flyctl secrets set GEMINI_API_KEY=your_gemini_key
flyctl secrets set NODE_ENV=production
```

Or set them in the Fly dashboard:

1. Go to [fly.io dashboard](https://fly.io/dashboard)
2. Select your app
3. Go to Variables → Secrets
4. Add each secret

## Step 3: Deploy

```bash
# Build and deploy
flyctl deploy

# Or with detailed logging
flyctl deploy --verbose
```

The first deploy takes ~2-3 minutes.

## Step 4: Monitor Your Bot

```bash
# View logs in real-time
flyctl logs

# Check app status
flyctl status

# SSH into the machine (if needed)
flyctl ssh console
```

## Step 5: Deploy Updates

After making changes:

```bash
git add .
git commit -m "your message"
git push

# Then deploy
flyctl deploy
```

## Useful Commands

```bash
# Restart the app
flyctl restart

# Stop the app
flyctl pause

# Resume the app
flyctl resume

# View secrets
flyctl secrets list

# Update a secret
flyctl secrets set SECRET_NAME=new_value

# Remove a secret
flyctl secrets unset SECRET_NAME

# Scale to multiple machines
flyctl scale count 3

# View app info
flyctl info
```

## Pricing

- **Free tier:** 3 shared-cpu-1x 256MB RAM VMs (~$2.94/month equivalent)
- **Your bot:** 1 VM is enough
- **Monthly cost:** ~$5-10 depending on usage

## Troubleshooting

**Bot not starting:**

```bash
flyctl logs
# Check the error messages
```

**Bot offline after a while:**

- Check if it's crashing: `flyctl logs`
- Add error handling in code
- Ensure all env vars are set correctly

**Commands not registering:**

```bash
flyctl ssh console
npm run deploy:commands
exit
```

**Port issues:**

- The app uses port 8080 internally
- Fly.io handles external routing automatically

## Keep Bot Running 24/7

Fly.io automatically restarts crashed apps. To ensure continuous uptime:

1. Deploy is complete
2. Bot runs in background on Fly's servers
3. If it crashes, it restarts automatically
4. Check logs regularly with `flyctl logs`

## Remove App (if needed)

```bash
flyctl destroy bvdvd-bot
```

This deletes the app from Fly.io.
