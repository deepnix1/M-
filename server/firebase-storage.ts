import { type User, type InsertUser, type Photo, type InsertPhoto } from "@shared/schema";
import { randomUUID } from "crypto";
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin
let app: any;

try {
  // Try to read from environment variable first
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "mihribancagatay-d5d82.appspot.com"
    });
  } else {
    // Try to read from JSON file
    const fs = await import('fs');
    const path = await import('path');
    const serviceAccountPath = path.join(process.cwd(), 'mihribancagatay-d5d82-firebase-adminsdk-fbsvc-8b3ecbc9dd.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: "mihribancagatay-d5d82.appspot.com"
      });
      console.log("Firebase initialized from JSON file");
    } else {
      console.warn("Firebase configuration not found. Using in-memory storage.");
      app = null;
    }
  }
} catch (error) {
  console.warn("Firebase initialization failed:", error);
  app = null;
}

const db = app ? getFirestore(app) : null;
const bucket = app ? getStorage(app).bucket() : null;

export class FirebaseStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error("Firebase not configured");
    const doc = await db.collection('users').doc(id).get();
    return doc.exists ? doc.data() as User : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error("Firebase not configured");
    const snapshot = await db.collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();
    
    return snapshot.empty ? undefined : snapshot.docs[0].data() as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Firebase not configured");
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    
    await db.collection('users').doc(id).set(user);
    return user;
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    if (!db) throw new Error("Firebase not configured");
    const id = randomUUID();
    const photo: Photo = {
      ...insertPhoto,
      id,
      description: insertPhoto.description || null,
      uploadedAt: new Date(),
    };

    await db.collection('photos').doc(id).set(photo);
    return photo;
  }

  async getAllPhotos(): Promise<Photo[]> {
    if (!db) throw new Error("Firebase not configured");
    const snapshot = await db.collection('photos')
      .orderBy('uploadedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => doc.data() as Photo);
  }

  async getPhoto(id: string): Promise<Photo | undefined> {
    if (!db) throw new Error("Firebase not configured");
    const doc = await db.collection('photos').doc(id).get();
    return doc.exists ? doc.data() as Photo : undefined;
  }

  async uploadImage(file: Buffer, filename: string): Promise<string> {
    if (!bucket) throw new Error("Firebase Storage not configured");
    const fileRef = bucket.file(`photos/${filename}`);
    await fileRef.save(file, {
      metadata: {
        contentType: 'image/jpeg',
      }
    });

    // Public URL oluştur
    await fileRef.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/photos/${filename}`;
  }

  async deleteImage(filename: string): Promise<void> {
    if (!bucket) throw new Error("Firebase Storage not configured");
    const fileRef = bucket.file(`photos/${filename}`);
    await fileRef.delete();
  }
}
