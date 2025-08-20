import express from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'crypto';
import multer from 'multer';

// Initialize Firebase Admin
let app;
let db;
let bucket;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "mihribancagatay-d5d82.firebasestorage.app"
    });
    db = getFirestore(app);
    bucket = getStorage(app).bucket();
  }
} catch (error) {
  console.warn("Firebase initialization failed:", error);
}

// Express app
const app_express = express();
app_express.use(express.json());

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// API Routes
app_express.get('/photos', async (req, res) => {
  try {
    if (!db) {
      return res.json([]);
    }
    
    const snapshot = await db.collection('photos')
      .orderBy('uploadedAt', 'desc')
      .get();
    
    const photos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

app_express.post('/photos', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not configured' });
    }
    
    const { filename, imageData, guestName, description } = req.body;
    
    const photoData = {
      id: randomUUID(),
      filename,
      imageData,
      guestName,
      description: description || null,
      uploadedAt: new Date(),
    };
    
    await db.collection('photos').doc(photoData.id).set(photoData);
    
    res.status(201).json(photoData);
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({ error: 'Failed to create photo' });
  }
});

app_express.post('/photos/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    
    if (!bucket) {
      return res.status(500).json({ error: 'Storage not configured' });
    }
    
    const filename = `${randomUUID()}.jpg`;
    const fileRef = bucket.file(`photos/${filename}`);
    
    await fileRef.save(req.file.buffer, {
      metadata: {
        contentType: 'image/jpeg',
      }
    });
    
    await fileRef.makePublic();
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/photos/${filename}`;
    
    const photoData = {
      id: randomUUID(),
      filename,
      imageUrl,
      description: req.body.description || null,
      uploadedAt: new Date(),
    };
    
    if (db) {
      await db.collection('photos').doc(photoData.id).set(photoData);
    }
    
    res.status(201).json(photoData);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: "Failed to upload photo" });
  }
});

// Netlify function handler
export const handler = app_express;
