import { type User, type InsertUser, type Photo, type InsertPhoto, users, photos } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";
import { FirebaseStorage } from "./firebase-storage";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  getAllPhotos(): Promise<Photo[]>;
  getPhoto(id: string): Promise<Photo | undefined>;
  uploadImage(buffer: Buffer, filename: string): Promise<string>;
}

// Initialize database connection
let sql: any;
let db: any;

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql);
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private photos: Map<string, Photo>;

  constructor() {
    this.users = new Map();
    this.photos = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const photo: Photo = {
      ...insertPhoto,
      id,
      description: insertPhoto.description || null,
      uploadedAt: new Date(),
    };
    this.photos.set(id, photo);
    return photo;
  }

  async getAllPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values()).sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );
  }

  async getPhoto(id: string): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async uploadImage(buffer: Buffer, filename: string): Promise<string> {
    // For local development, convert buffer to base64 data URL
    const base64 = buffer.toString('base64');
    const mimeType = 'image/jpeg'; // Default to JPEG
    return `data:${mimeType};base64,${base64}`;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const result = await db.insert(photos).values(insertPhoto).returning();
    return result[0];
  }

  async getAllPhotos(): Promise<Photo[]> {
    const result = await db.select().from(photos).orderBy(desc(photos.uploadedAt));
    return result[0];
  }

  async getPhoto(id: string): Promise<Photo | undefined> {
    const result = await db.select().from(photos).where(eq(photos.id, id));
    return result[0];
  }

  async uploadImage(buffer: Buffer, filename: string): Promise<string> {
    // For database storage, you might want to implement file storage
    // For now, return a placeholder
    throw new Error('File upload not implemented for database storage');
  }
}

export const storage = process.env.FIREBASE_CONFIG ? new FirebaseStorage() : new MemStorage();
