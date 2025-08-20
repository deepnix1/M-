import express from "express";
import { registerRoutes } from "./routes";
import { storage } from "./storage";

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("dist/public"));

// Register API routes
const server = await registerRoutes(app);

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    storage: storage.constructor.name 
  });
});

// Start server
const port = process.env.PORT || 5000;
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

server.listen(port, host, () => {
  console.log(`[express] serving on port ${port}`);
});
