import express from "express";
import { registerRoutes } from "./routes";
import { storage } from "./storage";

const app = express();

// Middleware
app.use(express.json());

// Add CSP headers for Render
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  );
  next();
});

app.use(express.static("dist/public"));

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    storage: storage.constructor.name 
  });
});

// SPA fallback for client-side routing
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  
  // Serve index.html for all other routes (SPA fallback)
  res.sendFile("dist/public/index.html", { root: process.cwd() });
});

// Start server
const port = process.env.PORT || 5000;
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

// Initialize server
(async () => {
  const server = await registerRoutes(app);
  
  server.listen(port, () => {
    console.log(`[express] serving on port ${port}`);
  });
})();
