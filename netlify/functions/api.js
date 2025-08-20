import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'crypto';

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
    console.log('Firebase initialized successfully');
  } else {
    console.warn('FIREBASE_SERVICE_ACCOUNT not found');
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

// Helper function to create response
const createResponse = (statusCode, data) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  },
  body: JSON.stringify(data)
});

// Netlify function handler
export const handler = async (event, context) => {
  console.log('Function called:', {
    method: event.httpMethod,
    path: event.path,
    hasBody: !!event.body,
    contentType: event.headers['content-type']
  });

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {});
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;

  try {
    // GET /photos - Fetch all photos
    if (path === '/photos' && method === 'GET') {
      if (!db) {
        console.log('Database not configured, returning empty array');
        return createResponse(200, []);
      }
      
      const snapshot = await db.collection('photos')
        .orderBy('uploadedAt', 'desc')
        .get();
      
      const photos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Returning ${photos.length} photos`);
      return createResponse(200, photos);
    }

    // POST /photos - Create photo with existing URL
    if (path === '/photos' && method === 'POST') {
      if (!db) {
        return createResponse(500, { error: 'Database not configured' });
      }
      
      const { filename, imageData, guestName, description } = JSON.parse(event.body || '{}');
      
      const photoData = {
        id: randomUUID(),
        filename,
        imageData,
        guestName,
        description: description || null,
        uploadedAt: new Date(),
      };
      
      await db.collection('photos').doc(photoData.id).set(photoData);
      
      return createResponse(201, photoData);
    }

    // POST /photos/upload - Upload new photo
    if (path === '/photos/upload' && method === 'POST') {
      console.log('Processing photo upload...');
      
      if (!bucket) {
        console.error('Storage bucket not configured');
        return createResponse(500, { error: 'Storage not configured' });
      }

      if (!event.body) {
        console.error('No body in request');
        return createResponse(400, { message: "No image file provided" });
      }

      // Parse multipart form data
      const contentType = event.headers['content-type'] || '';
      console.log('Content-Type:', contentType);
      
      const boundary = contentType.split('boundary=')[1];
      
      if (!boundary) {
        console.error('No boundary found in content-type');
        return createResponse(400, { message: "Invalid content type - no boundary" });
      }

      console.log('Boundary:', boundary);

      // Parse the multipart data
      const body = Buffer.from(event.body, 'base64');
      const bodyStr = body.toString();
      const parts = bodyStr.split(`--${boundary}`);

      console.log('Found', parts.length, 'parts');

      let imageBuffer = null;
      let description = '';

      for (const part of parts) {
        if (part.includes('Content-Disposition: form-data; name="image"')) {
          const imageStart = part.indexOf('\r\n\r\n') + 4;
          const imageEnd = part.lastIndexOf('\r\n');
          if (imageStart < imageEnd) {
            imageBuffer = Buffer.from(part.substring(imageStart, imageEnd));
            console.log('Image buffer created, size:', imageBuffer.length);
          }
        } else if (part.includes('Content-Disposition: form-data; name="description"')) {
          const descStart = part.indexOf('\r\n\r\n') + 4;
          const descEnd = part.lastIndexOf('\r\n');
          if (descStart < descEnd) {
            description = part.substring(descStart, descEnd);
            console.log('Description found:', description);
          }
        }
      }

      if (!imageBuffer) {
        console.error('No image buffer created');
        return createResponse(400, { message: "No image file provided" });
      }

      const filename = `${randomUUID()}.jpg`;
      const fileRef = bucket.file(`photos/${filename}`);

      console.log('Saving to Firebase Storage:', filename);

      await fileRef.save(imageBuffer, {
        metadata: {
          contentType: 'image/jpeg',
        }
      });

      console.log('File saved, making public...');

      await fileRef.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/photos/${filename}`;

      console.log('Image URL:', imageUrl);

      const photoData = {
        id: randomUUID(),
        filename,
        imageUrl,
        description: description || null,
        uploadedAt: new Date(),
      };

      if (db) {
        console.log('Saving to Firestore...');
        await db.collection('photos').doc(photoData.id).set(photoData);
        console.log('Photo saved to Firestore');
      }

      return createResponse(201, photoData);
    }

    // 404 for unknown routes
    console.log('Route not found:', path, method);
    return createResponse(404, { error: 'Not found' });

  } catch (error) {
    console.error('API Error:', error);
    return createResponse(500, { 
      error: 'Internal server error', 
      message: error.message,
      stack: error.stack 
    });
  }
};
