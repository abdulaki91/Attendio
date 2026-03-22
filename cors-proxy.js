// Temporary CORS proxy for production
// Run this on your production backend server

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Enable CORS for your frontend domain
app.use(
  cors({
    origin: "https://attendio.abdiko.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Proxy all requests to your existing backend
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://attendio-backend.abdiko.com",
    changeOrigin: true,
    secure: true,
    onProxyReq: (proxyReq, req, res) => {
      // Add CORS headers to the proxied request
      proxyReq.setHeader(
        "Access-Control-Allow-Origin",
        "https://attendio.abdiko.com",
      );
    },
  }),
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CORS Proxy running on port ${PORT}`);
});

// Instructions:
// 1. Install dependencies: npm install express http-proxy-middleware cors
// 2. Run this file: node cors-proxy.js
// 3. Update your frontend to use this proxy URL instead
