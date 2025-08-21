# Firebase Setup Guide

## Environment Variables Required

To use Firebase in production (Vercel), you need to set the following environment variables:

### 1. FIREBASE_SERVICE_ACCOUNT
This should contain the entire content of your Firebase service account JSON file as a single line.

**How to get it:**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Copy the entire content and paste it as the value for `FIREBASE_SERVICE_ACCOUNT`

**Example:**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

### 2. FIREBASE_STORAGE_BUCKET (Optional)
If your storage bucket name is different from the default `{project-id}.appspot.com`, set this variable.

### 3. DATABASE_URL (Optional)
If you're using Neon database, set this to your database connection string.

## Vercel Configuration

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the `FIREBASE_SERVICE_ACCOUNT` variable with your service account JSON
4. Add any other required environment variables
5. Redeploy your application

## Security Notes

- **Never commit Firebase service account files to your repository**
- **Always use environment variables for sensitive configuration**
- **The `.gitignore` file has been updated to prevent accidental commits**

## Local Development

For local development, you can create a `.env` file with the same variables, but never commit it to version control.
