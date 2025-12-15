# Study Materials Admin Backend

Vercel serverless API for managing Google Drive permissions automatically.

## Features

- **Automatic Permission Granting**: Grant write access to all semester folders for doctors
- **Permission Checking**: Verify if a user has access to specific folders
- **Service Account Authentication**: Secure server-side Drive API access
- **CORS Enabled**: Works with Flutter web/mobile apps

## API Endpoints

### 1. Grant Access
**POST** `/api/grant-access`

Grants write access to all semester folders for a doctor.

**Request:**
```json
{
  "email": "doctor@example.com",
  "apiKey": "your-admin-api-key"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Access granted to 48 folders",
  "email": "doctor@example.com",
  "stats": {
    "total": 48,
    "granted": 48,
    "failed": 0,
    "alreadyHadAccess": 0
  }
}
```

### 2. Check Access
**POST** `/api/check-access`

Check if a user has access to a specific folder.

**Request:**
```json
{
  "email": "doctor@example.com",
  "folderId": "1F-aqh6UK5x8Cbva6Zr0UvnchyV8hDGp2",
  "apiKey": "your-admin-api-key"
}
```

**Response:**
```json
{
  "hasAccess": true,
  "role": "writer",
  "email": "doctor@example.com",
  "folderId": "1F-aqh6UK5x8Cbva6Zr0UvnchyV8hDGp2"
}
```

## Setup Instructions

### 1. Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Drive API**
4. Go to **"IAM & Admin"** → **"Service Accounts"**
5. Click **"Create Service Account"**
6. Name it: "Study Materials Admin Service"
7. Click **"Create and Continue"**
8. Skip role assignment (click "Continue")
9. Click **"Done"**
10. Click on the created service account
11. Go to **"Keys"** tab
12. Click **"Add Key"** → **"Create new key"**
13. Choose **JSON** format
14. Download the key file

### 2. Share Folders with Service Account

1. Open the downloaded JSON key file
2. Copy the `client_email` value (looks like: `xxx@xxx.iam.gserviceaccount.com`)
3. In Google Drive, share ALL semester folders with this email as **"Editor"**
   - You can select all folders and share at once
   - Make sure to grant "Editor" access

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from backend directory:
   ```bash
   cd backend
   vercel
   ```

4. Follow prompts to link to your GitHub repo

#### Option B: Deploy via GitHub

1. Push this backend folder to your GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Set **Root Directory** to `backend`
6. Click **"Deploy"**

### 4. Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add these variables:

1. **GOOGLE_SERVICE_ACCOUNT_EMAIL**
   - Value: Copy `client_email` from your JSON key file
   - Example: `study-admin@project-123.iam.gserviceaccount.com`

2. **GOOGLE_PRIVATE_KEY**
   - Value: Copy `private_key` from your JSON key file
   - **Important**: Keep the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts
   - Make sure newlines are preserved (or use `\\n` for line breaks)

3. **ADMIN_API_KEY**
   - Value: Generate a random secure key
   - Example: `sk_live_abc123xyz789` (use any random string)
   - **Save this key** - you'll need it in the Flutter app

### 5. Redeploy

After adding environment variables, redeploy:
```bash
vercel --prod
```

Or trigger a redeploy from Vercel Dashboard.

### 6. Test the API

```bash
curl -X POST https://your-app.vercel.app/api/grant-access \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "apiKey": "your-admin-api-key"
  }'
```

## Security Notes

- **Never commit** the service account JSON key to Git
- **Keep the API key secret** - only embed it in the Flutter app
- Service account only has access to folders you explicitly share with it
- All API calls require the API key for authentication

## Troubleshooting

### "Service account credentials not configured"
- Check environment variables are set correctly in Vercel
- Ensure `GOOGLE_PRIVATE_KEY` includes the full key with headers

### "Permission denied" errors
- Verify the service account email has "Editor" access to all folders
- Check folder IDs are correct

### CORS errors
- The API includes CORS headers for all origins
- If issues persist, check Vercel logs

## Cost

- **Vercel Free Tier**: 100GB bandwidth, unlimited requests
- **Google Drive API**: Free (no quota limits for Drive operations)
- **Total Cost**: $0 for typical usage

## Monitoring

View logs in Vercel Dashboard → Your Project → Logs
