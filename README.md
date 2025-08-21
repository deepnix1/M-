# M- Photo Application

A modern photo sharing application built with React, Express, and Firebase.

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Production Deployment

#### Render Deployment (Recommended)
1. **Prepare your project:**
   ```bash
   # Run the deployment script
   ./deploy.sh          # Linux/Mac
   deploy.bat           # Windows
   ```

2. **Follow the Render deployment guide:**
   - [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

#### Vercel Deployment
1. **Set environment variables** in Vercel dashboard
2. **Deploy** using Vercel CLI or dashboard

## 🔧 Environment Variables

Create a `.env` file in your project root:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Database (optional)
DATABASE_URL=postgresql://username:password@host:port/database
```

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/               # Source code
│   ├── dist/              # Built files (after npm run build)
│   └── package.json       # Frontend dependencies
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── firebase-storage.ts # Firebase integration
├── shared/                 # Shared schemas and types
├── render.yaml            # Render deployment config
└── package.json           # Root dependencies
```

## 🚀 Deployment Scripts

- **`deploy.sh`** - Linux/Mac deployment script
- **`deploy.bat`** - Windows deployment script
- **`setup-firebase.js`** - Firebase configuration helper

## 🔒 Security

- Firebase service account files are **never committed** to the repository
- All sensitive configuration uses environment variables
- `.gitignore` prevents accidental commits of sensitive files

## 📚 Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Render Deployment Guide](./RENDER_DEPLOYMENT.md)

## 🛠️ Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **Database**: Firebase Firestore, Neon PostgreSQL (optional)
- **Storage**: Firebase Storage
- **Deployment**: Render, Vercel

## 📝 License

MIT License
