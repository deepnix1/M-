# M- Wedding Photo Gallery

A modern wedding photo gallery built with React, TypeScript, and Firebase, deployed on Vercel.

## Features

- 📸 Photo upload and gallery display
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 Firebase Storage integration
- 📱 Mobile-friendly design
- ⚡ Fast performance with Vite

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Storage**: Firebase Storage
- **Database**: Neon PostgreSQL (optional)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- Firebase project with Storage enabled
- Vercel account

### Local Development

1. Clone the repository
```bash
git clone <your-repo-url>
cd M-
```

2. Install dependencies
```bash
npm install
cd client && npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

4. Start development server
```bash
npm run dev
```

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `FIREBASE_SERVICE_ACCOUNT`: Your Firebase service account JSON
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket name
4. Deploy!

## Project Structure

```
├── api/                    # Vercel API routes
│   ├── photos.ts          # Photo CRUD operations
│   └── photos/[id].ts     # Individual photo operations
├── client/                 # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── shared/                 # Shared schemas and types
├── server/                 # Server utilities (storage, etc.)
├── vercel.json            # Vercel configuration
└── package.json           # Root package.json
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket name | Yes |

## API Endpoints

- `GET /api/photos` - Get all photos
- `POST /api/photos/upload` - Upload a new photo
- `POST /api/photos` - Create a photo with existing URL
- `GET /api/photos/[id]` - Get a specific photo

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License
