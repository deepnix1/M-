import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPhotoSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
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

  // Get all photos
  app.get("/api/photos", async (req, res) => {
    try {
      const photos = await storage.getAllPhotos();
      res.json(photos);
    } catch (error) {
      console.error('Error fetching photos:', error);
      res.status(500).json({ message: "Failed to fetch photos", error: error.message });
    }
  });

  // Upload photo with file
  app.post("/api/photos/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      console.log('File received:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      const filename = `${randomUUID()}.jpg`;
      
      // Check if storage has uploadImage method
      if (typeof (storage as any).uploadImage !== 'function') {
        console.error('Storage does not support uploadImage method');
        return res.status(500).json({ message: "Storage does not support file uploads" });
      }

      const imageUrl = await (storage as any).uploadImage(req.file.buffer, filename);
      
      const photoData = {
        filename,
        imageUrl,
        description: req.body.description || null,
        uploadedAt: new Date(),
      };

      console.log('Photo data created:', photoData);

      const photo = await storage.createPhoto(photoData);
      console.log('Photo saved successfully:', photo);
      
      res.status(201).json(photo);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        message: "Failed to upload photo", 
        error: error.message,
        stack: error.stack 
      });
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

  const httpServer = createServer(app);
  return httpServer;
}
