# RAG Chatbot Deployment Guide

**Feature**: Integrated RAG Chatbot for AI/Spec-Driven Textbook
**Status**: Production Ready
**Last Updated**: 2025-12-16

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (GitHub Pages)](#frontend-deployment-github-pages)
4. [Environment Variables](#environment-variables)
5. [CI/CD Workflows](#cicd-workflows)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

1. **Render Account** (Free Tier)
   - Sign up at: https://render.com
   - Free tier: 750 hours/month

2. **Qdrant Cloud Account** (Free Tier)
   - Sign up at: https://qdrant.tech/cloud/
   - Free tier: 1GB storage
   - Create cluster and note URL + API key

3. **Cohere Account** (Free Tier)
   - Sign up at: https://cohere.com
   - Free tier: 1000 requests/month
   - Get API key from dashboard

4. **Google AI Studio** (Gemini API)
   - Sign up at: https://makersuite.google.com/app/apikey
   - Free tier: 60 requests/minute
   - Generate API key

5. **GitHub Account**
   - Repository already on GitHub
   - GitHub Pages enabled

### Required Tools

- Git (latest version)
- Node.js v20+ (for local testing)
- Python 3.10+ (for local testing)

---

## Backend Deployment (Render)

### Step 1: Create Web Service on Render

1. **Log in to Render Dashboard**:
   - Go to https://dashboard.render.com/

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `mairanoor412/humanoid-robotics`
   - Select branch: `main` (or your deployment branch)

3. **Configure Build Settings**:
   ```
   Name: rag-chatbot-backend
   Environment: Python 3
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Configure Instance**:
   - Plan: Free (or Starter for better performance)
   - Auto-Deploy: Yes (deploy on git push)

### Step 2: Set Environment Variables

In Render dashboard, add these environment variables:

```bash
# API Keys (required)
COHERE_API_KEY=<your-cohere-api-key>
QDRANT_URL=https://<your-cluster-id>.aws.cloud.qdrant.io
QDRANT_API_KEY=<your-qdrant-api-key>
GEMINI_API_KEY=<your-gemini-api-key>

# OpenAI SDK Configuration (required)
OPENAI_API_BASE=https://generativelanguage.googleapis.com/v1beta/openai/

# Environment (required)
ENVIRONMENT=production

# CORS (required - update with your GitHub Pages URL)
CORS_ORIGINS=https://mairanoor412.github.io

# Qdrant Collection (required)
QDRANT_COLLECTION_NAME=textbook_sections

# Rate Limiting (optional - defaults shown)
RATE_LIMIT_QUERIES=10
RATE_LIMIT_WINDOW_SECONDS=60
```

### Step 3: Deploy

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Note the service URL (e.g., `https://rag-chatbot-backend.onrender.com`)

### Step 4: Generate Embeddings

After deployment, you need to populate Qdrant with textbook embeddings:

```bash
# SSH into Render instance or run locally
cd backend
python scripts/generate_embeddings.py --textbook-path ../textbook/docs
```

**Note**: This only needs to be done once, or when textbook content changes.

---

## Frontend Deployment (GitHub Pages)

### Step 1: Configure GitHub Repository

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

2. **Add Repository Secrets**:
   - Go to Settings → Secrets and variables → Actions
   - Add the following secrets:

   ```
   BACKEND_URL=https://rag-chatbot-backend.onrender.com
   RENDER_DEPLOY_HOOK_URL=<your-render-deploy-hook-url>
   ```

   To get Render Deploy Hook URL:
   - Go to Render dashboard → Your service → Settings
   - Scroll to "Deploy Hook"
   - Copy the URL

### Step 2: Update Docusaurus Config

Ensure `textbook/docusaurus.config.js` has correct `baseUrl`:

```javascript
module.exports = {
  url: 'https://mairanoor412.github.io',
  baseUrl: '/ai-spec-driven-textbook/', // or '/humanoid-robotics/'
  // ... other config
};
```

### Step 3: Deploy

**Option A: Automatic (via GitHub Actions)**

Simply push to `main` branch:
```bash
git add .
git commit -m "Deploy chatbot"
git push origin main
```

The workflow will automatically:
1. Detect changes in `textbook/**`
2. Build the Docusaurus site
3. Deploy to GitHub Pages

**Option B: Manual**

```bash
cd textbook
npm run build
npm run deploy
```

### Step 4: Verify Deployment

After 1-2 minutes, visit:
```
https://mairanoor412.github.io/ai-spec-driven-textbook/
```

---

## Environment Variables

### Backend Environment Variables (Render)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `COHERE_API_KEY` | Yes | Cohere API key for embeddings | `abc123...` |
| `QDRANT_URL` | Yes | Qdrant cluster URL | `https://xyz.aws.cloud.qdrant.io` |
| `QDRANT_API_KEY` | Yes | Qdrant API key | `def456...` |
| `GEMINI_API_KEY` | Yes | Google Gemini API key | `ghi789...` |
| `OPENAI_API_BASE` | Yes | OpenAI SDK base URL for Gemini | `https://generativelanguage.googleapis.com/v1beta/openai/` |
| `ENVIRONMENT` | Yes | Environment name | `production` |
| `CORS_ORIGINS` | Yes | Allowed CORS origins (comma-separated) | `https://mairanoor412.github.io` |
| `QDRANT_COLLECTION_NAME` | Yes | Qdrant collection name | `textbook_sections` |
| `RATE_LIMIT_QUERIES` | No | Max queries per window | `10` |
| `RATE_LIMIT_WINDOW_SECONDS` | No | Rate limit window in seconds | `60` |

### Frontend Environment Variables (GitHub Actions)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `REACT_APP_CHATBOT_API_URL` | Yes | Backend API URL | `https://rag-chatbot-backend.onrender.com` |

---

## CI/CD Workflows

### Backend Workflow (`.github/workflows/deploy-backend.yml`)

**Trigger**: Push to `main` with changes in `backend/**`

**Steps**:
1. Checkout code
2. Trigger Render deploy hook
3. Wait for deployment
4. Verify health endpoint
5. Generate deployment summary

**Required Secrets**:
- `RENDER_DEPLOY_HOOK_URL`
- `BACKEND_URL`

### Frontend Workflow (`.github/workflows/deploy-frontend.yml`)

**Trigger**: Push to `main` with changes in `textbook/**`

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Build Docusaurus site (with backend URL)
5. Deploy to GitHub Pages
6. Generate deployment summary

**Required Secrets**:
- `BACKEND_URL`
- `GITHUB_TOKEN` (automatically provided)

---

## Post-Deployment Verification

### Backend Health Check

```bash
# Check backend health
curl https://rag-chatbot-backend.onrender.com/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-12-16T12:00:00Z",
  "services": {
    "qdrant": "connected",
    "embedding_service": "available",
    "llm_service": "available"
  },
  "version": "1.0.0"
}
```

### Frontend Chatbot Test

1. **Visit Site**: https://mairanoor412.github.io/ai-spec-driven-textbook/
2. **Open Chatbot**: Click floating button (bottom-right) or press `Ctrl+/`
3. **Test Query**: Ask "What is inverse kinematics?"
4. **Verify**:
   - Response streams in real-time
   - Citations are clickable links
   - No CORS errors in browser console

### Full Feature Test

- [ ] Chatbot opens/closes with button and `Ctrl+/`
- [ ] Questions receive streaming responses
- [ ] Citations navigate to correct sections
- [ ] Text selection shows "Ask about this" button
- [ ] Conversation persists across page navigation
- [ ] Rate limiting activates after 10 queries
- [ ] Mobile responsive (test on phone)

---

## Troubleshooting

### Issue: "CORS Error" in Browser Console

**Cause**: Backend `CORS_ORIGINS` doesn't match frontend URL

**Solution**:
```bash
# Update Render environment variable
CORS_ORIGINS=https://mairanoor412.github.io

# Restart backend service
```

### Issue: "Backend Unavailable" Error

**Cause**: Render free tier instance went to sleep (after 15 min inactivity)

**Solution**:
- Wait 30-60 seconds for instance to wake up
- First request will be slow, subsequent requests fast
- Consider upgrading to Starter plan for always-on instance

### Issue: "No Information Found" for All Questions

**Cause**: Embeddings not generated in Qdrant

**Solution**:
```bash
# Run embedding generation script
cd backend
python scripts/generate_embeddings.py --textbook-path ../textbook/docs
```

### Issue: "Rate Limit Exceeded" Immediately

**Cause**: localStorage has stale rate limit data

**Solution**:
```javascript
// Clear in browser console
localStorage.removeItem('chatbot_session');
localStorage.removeItem('chatbot_queries');
```

### Issue: GitHub Pages Shows 404

**Cause**: Incorrect `baseUrl` in `docusaurus.config.js`

**Solution**:
```javascript
// Update baseUrl to match repository name
baseUrl: '/ai-spec-driven-textbook/', // Must match repo name or custom domain
```

### Issue: Build Fails on GitHub Actions

**Cause**: Node.js version mismatch

**Solution**:
```yaml
# In .github/workflows/deploy-frontend.yml, ensure:
node-version: '20'  # Docusaurus 3 requires Node 18+
```

---

## Monitoring & Maintenance

### Backend Monitoring (Render)

- **Logs**: Render Dashboard → Service → Logs
- **Metrics**: Render Dashboard → Service → Metrics
- **Alerts**: Configure in Render Dashboard → Service → Alerts

### Frontend Monitoring

- **GitHub Actions**: Repository → Actions tab
- **Analytics**: Add Google Analytics to Docusaurus config
- **Uptime**: Use services like UptimeRobot (https://uptimerobot.com)

### Regular Maintenance

**Monthly**:
- [ ] Check API quotas (Cohere, Gemini, Qdrant)
- [ ] Review Render usage (ensure within free tier)
- [ ] Update dependencies (`npm outdated`, `pip list --outdated`)

**When Textbook Changes**:
- [ ] Re-run embedding generation script
- [ ] Verify new content appears in chatbot responses

**When Dependencies Update**:
- [ ] Test locally first
- [ ] Deploy to staging branch (if available)
- [ ] Monitor for errors after deployment

---

## Rollback Procedure

### Backend Rollback

1. **Via Render Dashboard**:
   - Go to Service → Deploys
   - Find previous successful deployment
   - Click "Rollback to this deploy"

2. **Via Git**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

### Frontend Rollback

1. **Via GitHub**:
   ```bash
   # Revert commit and push
   git revert <commit-hash>
   git push origin main

   # Wait for GitHub Actions to deploy
   ```

2. **Manual**:
   ```bash
   # Checkout previous version
   git checkout <previous-commit>

   # Build and deploy
   cd textbook
   npm run build
   npm run deploy
   ```

---

## Security Best Practices

1. **Never commit secrets**:
   - Use `.env` files (git-ignored)
   - Store in Render/GitHub Secrets

2. **HTTPS only**:
   - Backend: Automatic on Render
   - Frontend: Automatic on GitHub Pages

3. **API key rotation**:
   - Rotate keys quarterly
   - Update in Render environment variables

4. **CORS restrictions**:
   - Only allow your GitHub Pages domain
   - Never use `*` wildcard in production

5. **Rate limiting**:
   - Keep at 10 queries/minute/session
   - Monitor for abuse in Render logs

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Docusaurus Deployment**: https://docusaurus.io/docs/deployment
- **Qdrant Docs**: https://qdrant.tech/documentation/
- **Cohere Docs**: https://docs.cohere.com/
- **Gemini API Docs**: https://ai.google.dev/gemini-api/docs

**For Issues**:
1. Check troubleshooting section above
2. Review Render logs (backend errors)
3. Review browser console (frontend errors)
4. Check GitHub Actions logs (deployment errors)

---

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables set in Render
- [ ] Backend health endpoint returns 200
- [ ] Embeddings generated in Qdrant
- [ ] CORS origins match GitHub Pages URL
- [ ] GitHub repository secrets configured
- [ ] `baseUrl` in `docusaurus.config.js` correct
- [ ] CI/CD workflows tested
- [ ] Mobile responsive verified
- [ ] Accessibility tested (Lighthouse audit)
- [ ] Rate limiting tested
- [ ] Error handling tested

**Ready to Deploy!** 🚀
