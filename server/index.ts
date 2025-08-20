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
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;"
  );
  next();
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    storage: storage.constructor.name 
  });
});

// Initialize server with routes
(async () => {
  const server = await registerRoutes(app);
  
  // Serve static files
  app.use(express.static("dist/public"));
  
  // SPA fallback for client-side routing (MUST be last)
  app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    
    // Serve index.html for all other routes (SPA fallback)
    res.sendFile("index.html", { root: "dist/public" });
  });
  
  // Start server
  const port = process.env.PORT || 5000;
  
  server.listen(port, () => {
    console.log(`[express] serving on port ${port}`);
  });
})();
