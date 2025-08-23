import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPhotoSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('Registering routes...');
  
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    },
  });

  // Multer error handler middleware
  const handleMulterError = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: "File too large. Maximum size is 50MB." });
      }
      return res.status(400).json({ message: `Upload error: ${error.message}` });
    }
    next(error);
  };

  // Get all photos
  app.get("/api/photos", async (req, res) => {
    try {
      const photos = await storage.getAllPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  // Upload photo with file
  app.post("/api/photos/upload", upload.single('image'), handleMulterError, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const filename = `${randomUUID()}.jpg`;
      const imageUrl = await (storage as any).uploadImage(req.file.buffer, filename);
      
      const photoData = {
        filename,
        imageData: imageUrl, // Use imageUrl as imageData
        guestName: req.body.guestName || 'Anonymous', // Default guest name
        description: req.body.description || null,
      };

      const photo = await storage.createPhoto(photoData);
      res.status(201).json(photo);
    } catch (error) {
      console.error('Upload error:', error);
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('File too large')) {
          res.status(413).json({ message: "File too large. Maximum size is 50MB." });
        } else {
          res.status(500).json({ message: error.message || "Failed to upload photo" });
        }
      } else {
        res.status(500).json({ message: "Failed to upload photo" });
      }
    }
  });

  // Create new photo (for existing URLs)
  app.post("/api/photos", async (req, res) => {
    try {
      const validatedData = insertPhotoSchema.parse(req.body);
      const photo = await storage.createPhoto(validatedData);
      res.status(201).json(photo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid photo data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create photo" });
      }
    }
  });

  // Get single photo
  app.get("/api/photos/:id", async (req, res) => {
    try {
      const photo = await storage.getPhoto(req.params.id);
      if (!photo) {
        res.status(404).json({ message: "Photo not found" });
        return;
      }
      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photo" });
    }
  });

  // Download photo endpoint
  app.get("/api/photos/:id/download", async (req, res) => {
    try {
      const photo = await storage.getPhoto(req.params.id);
      if (!photo) {
        res.status(404).json({ message: "Photo not found" });
        return;
      }

      const imageUrl = (photo as any).imageUrl || (photo as any).imageData;
      if (!imageUrl) {
        res.status(404).json({ message: "Photo URL not found" });
        return;
      }

      // Fetch the image from Firebase Storage
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const imageBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(imageBuffer);

      // Set appropriate headers for download
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${photo.filename || 'photo.jpg'}"`,
        'Content-Length': buffer.length.toString(),
      });

      res.send(buffer);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ message: "Failed to download photo" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
