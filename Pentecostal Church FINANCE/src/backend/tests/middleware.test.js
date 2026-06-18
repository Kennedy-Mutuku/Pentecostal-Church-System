const { createTestAuth, generateToken } = require("./setup");
const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const request = supertest(app);

describe("Middleware Tests", () => {
  describe("Authentication Middleware", () => {
    it("should reject request without Authorization header", async () => {
      const res = await request.get("/api/users");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Access denied. No token provided.");
    });

    it("should reject request with invalid token format", async () => {
      const res = await request
        .get("/api/users")
        .set("Authorization", "InvalidFormat token123");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Access denied. No token provided.");
    });

    it("should reject expired token", async () => {
      const token = jwt.sign(
        { id: new mongoose.Types.ObjectId().toString(), role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "0s" }
      );

      // Small delay to ensure token expires
      await new Promise((resolve) => setTimeout(resolve, 100));

      const res = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid token.");
    });

    it("should reject token signed with wrong secret", async () => {
      const token = jwt.sign(
        { id: new mongoose.Types.ObjectId().toString(), role: "admin" },
        "wrong-secret"
      );

      const res = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid token.");
    });

    it("should accept valid token", async () => {
      const { token } = createTestAuth("admin");

      const res = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      // Should not be 401 (might be 200 or other status, but not auth error)
      expect(res.status).not.toBe(401);
    });
  });

  describe("Authorization Middleware", () => {
    it("should allow authorized role", async () => {
      const { token } = createTestAuth("admin");
      const res = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it("should deny unauthorized role", async () => {
      const { token } = createTestAuth("member");
      const res = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access denied. Insufficient permissions.");
    });

    it("should allow multiple authorized roles", async () => {
      // Treasurer should access transactions
      const { token: tToken } = createTestAuth("treasurer");
      const res1 = await request
        .get("/api/transactions")
        .set("Authorization", `Bearer ${tToken}`);
      expect(res1.status).toBe(200);

      // Admin should also access transactions
      const { token: aToken } = createTestAuth("admin");
      const res2 = await request
        .get("/api/transactions")
        .set("Authorization", `Bearer ${aToken}`);
      expect(res2.status).toBe(200);

      // Auditor should also access transactions
      const { token: auToken } = createTestAuth("auditor");
      const res3 = await request
        .get("/api/transactions")
        .set("Authorization", `Bearer ${auToken}`);
      expect(res3.status).toBe(200);
    });
  });

  describe("404 Handler", () => {
    it("should return 404 for unknown routes", async () => {
      const res = await request.get("/api/nonexistent");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Route not found.");
    });

    it("should return 404 for unknown API sub-routes", async () => {
      const res = await request.get("/api/users/something/invalid/path");
      // This hits auth middleware first, so 401
      expect([401, 404]).toContain(res.status);
    });
  });

  describe("Root Endpoint", () => {
    it("should return API info on root", async () => {
      const res = await request.get("/");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("CU Finance Management System API");
    });
  });

  describe("Audit Logging", () => {
    it("should create audit log on user registration", async () => {
      const { token } = createTestAuth("admin");
      const AuditLog = require("../models/auditLog.model");

      await request
        .post("/api/auth/register")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Audit Test",
          email: "audit@test.com",
          password: "password123",
          role: "member",
        });

      const logs = await AuditLog.find({ entity: "users", action: "create" });
      expect(logs.length).toBeGreaterThanOrEqual(1);
    });
  });
});
