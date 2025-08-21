# 🚀 Render Deployment Guide

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your project should be on GitHub
3. **Firebase Project**: Set up Firebase for your application

## Step 1: Prepare Your Project

### 1.1 Build the Client
```bash
npm run build
```

This will create a `client/dist` folder with your built React application.

### 1.2 Environment Variables
Create a `.env` file in your project root with:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}

# Firebase Storage Bucket
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

## Step 2: Deploy to Render

### 2.1 Connect Your Repository
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select your repository

### 2.2 Configure the Service

**Basic Settings:**
- **Name**: `m-photo-app` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`

**Build & Deploy Settings:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx tsx server/index.ts`
- **Plan**: `Free` (or choose paid plan)

### 2.3 Environment Variables
Add these environment variables in Render:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `FIREBASE_SERVICE_ACCOUNT` | `{your-firebase-service-account-json}` |
| `FIREBASE_STORAGE_BUCKET` | `your-project-id.appspot.com` |

### 2.4 Health Check
- **Health Check Path**: `/api/photos`

## Step 3: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Wait for the build to complete (usually 5-10 minutes)

## Step 4: Verify Deployment

1. **Check Build Logs**: Ensure no errors during build
2. **Test API Endpoints**: Visit `https://your-app.onrender.com/api/photos`
3. **Test Frontend**: Visit your app URL to ensure it loads

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check if all dependencies are in `package.json`
2. **Port Issues**: Ensure `PORT` environment variable is set
3. **Firebase Errors**: Verify `FIREBASE_SERVICE_ACCOUNT` is correct
4. **Static Files Not Loading**: Ensure `npm run build` completed successfully

### Environment Variable Format:
The `FIREBASE_SERVICE_ACCOUNT` should be the entire JSON content as a single line, with quotes escaped properly.

## Production Considerations

1. **Custom Domain**: Add your domain in Render settings
2. **SSL**: Render provides free SSL certificates
3. **Scaling**: Upgrade to paid plans for better performance
4. **Monitoring**: Use Render's built-in monitoring tools

## Support

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Project Issues**: Check your repository's issue tracker
