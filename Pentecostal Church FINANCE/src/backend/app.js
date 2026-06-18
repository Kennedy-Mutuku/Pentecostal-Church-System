const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");
const requisitionRoutes = require("./routes/requisition.routes");
const assetRoutes = require("./routes/asset.routes");
const userRoutes = require("./routes/user.routes");
const reportRoutes = require("./routes/report.routes");
const auditRoutes = require("./routes/audit.routes");
const flagRoutes = require("./routes/flag.routes");
const mpesaRoutes = require("./routes/mpesa.routes");
const { authLimiter, apiLimiter } = require("./middleware/rateLimiter");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rate limiting
if (process.env.NODE_ENV !== "test") {
  app.use("/api", apiLimiter);
}
app.use("/api/auth", authLimiter);

// Routes
app.use("/api/auth", authRoutes);  // authLimiter already applied above
app.use("/api/transactions", transactionRoutes);
app.use("/api/requisitions", requisitionRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/flags", flagRoutes);
app.use("/api/mpesa", mpesaRoutes);

// Production: serve frontend build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "CU Finance Management System API" });
  });
  // 404 Handler (dev only - production uses frontend catch-all)
  app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
}

// Global Error Handler for File Uploads and other errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "File too large. Maximum size is 5 MB." });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected file field." });
    }
    return res.status(400).json({ message: `File upload error: ${err.message}` });
  } else if (err.message === "INVALID_FILE_TYPE") {
    return res.status(400).json({ message: "Only image files (jpg, jpeg, png) and PDF files are allowed." });
  }

  console.error(err);
  res.status(500).json({ message: "Server error.", error: err.message });
});

module.exports = app;
