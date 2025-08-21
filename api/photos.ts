import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertPhotoSchema } from '../shared/schema';
import { z } from 'zod';
import multer from 'multer';
import { randomUUID } from 'crypto';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Multer error handler middleware
const handleMulterError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: "File too large. Maximum size is 50MB." });
    }
    return res.status(400).json({ message: `Upload error: ${error.message}` });
  }
  next(error);
};

// Helper function to handle multer with Vercel
const runMiddleware = (req: VercelRequest, res: VercelResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get all photos
      const photos = await storage.getAllPhotos();
      res.status(200).json(photos);
    } else if (req.method === 'POST') {
      // Handle file upload
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        // File upload
        await runMiddleware(req, res, handleMulterError);
        await runMiddleware(req, res, upload.single('image'));

        if (!(req as any).file) {
          return res.status(400).json({ message: "No image file provided" });
        }

        const filename = `${randomUUID()}.jpg`;
        const imageUrl = await (storage as any).uploadImage((req as any).file.buffer, filename);
        
        const photoData = {
          filename,
          imageData: imageUrl,
          guestName: (req as any).body.guestName || 'Anonymous',
          description: (req as any).body.description || null,
        };

        const photo = await storage.createPhoto(photoData);
        res.status(201).json(photo);
      } else {
        // Create new photo (for existing URLs)
        const validatedData = insertPhotoSchema.parse(req.body);
        const photo = await storage.createPhoto(validatedData);
        res.status(201).json(photo);
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid data", errors: error.errors });
    } else if (error instanceof Error) {
      if (error.message.includes('File too large')) {
        res.status(413).json({ message: "File too large. Maximum size is 50MB." });
      } else if (error.message.includes('Storage bucket not found')) {
        res.status(500).json({ message: "Storage configuration error. Please check Firebase settings." });
      } else {
        res.status(500).json({ message: error.message || "Internal server error" });
      }
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
