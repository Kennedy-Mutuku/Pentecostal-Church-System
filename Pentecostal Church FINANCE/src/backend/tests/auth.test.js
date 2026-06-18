const { createTestAuth } = require("./setup");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const request = supertest(app);

describe("Auth Endpoints", () => {
  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const password = await bcrypt.hash("password123", 10);
      await User.create({
        name: "Test User",
        email: "login@test.com",
        password,
        role: "admin",
      });

      const res = await request.post("/api/auth/login").send({
        email: "login@test.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful.");
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("login@test.com");
      expect(res.body.user.role).toBe("admin");
    });

    it("should reject invalid email", async () => {
      const res = await request.post("/api/auth/login").send({
        email: "nonexistent@test.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid email or password.");
    });

    it("should reject wrong password", async () => {
      const password = await bcrypt.hash("password123", 10);
      await User.create({
        name: "Test User",
        email: "wrong@test.com",
        password,
        role: "member",
      });

      const res = await request.post("/api/auth/login").send({
        email: "wrong@test.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid email or password.");
    });

    it("should fail validation with missing email", async () => {
      const res = await request.post("/api/auth/login").send({
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("should fail validation with invalid email format", async () => {
      const res = await request.post("/api/auth/login").send({
        email: "not-an-email",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("should fail validation with short password", async () => {
      const res = await request.post("/api/auth/login").send({
        email: "test@test.com",
        password: "12345",
      });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user (admin only)", async () => {
      const { token } = createTestAuth("admin");

      const res = await request
        .post("/api/auth/register")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "New User",
          email: "new@test.com",
          phone: "0712345678",
          password: "password123",
          role: "treasurer",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully.");
      expect(res.body.id).toBeDefined();

      // Verify user was created in DB
      const user = await User.findById(res.body.id);
      expect(user).not.toBeNull();
      expect(user.email).toBe("new@test.com");
      expect(user.role).toBe("treasurer");
    });

    it("should reject duplicate email", async () => {
      const { token } = createTestAuth("admin");
      await User.create({
        name: "Existing",
        email: "dup@test.com",
        password: "hashed",
        role: "member",
      });

      const res = await request
        .post("/api/auth/register")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Duplicate",
          email: "dup@test.com",
          password: "password123",
          role: "member",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email already registered.");
    });

    it("should deny registration for non-admin", async () => {
      const { token } = createTestAuth("member");

      const res = await request
        .post("/api/auth/register")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Unauthorized",
          email: "unauth@test.com",
          password: "password123",
        });

      expect(res.status).toBe(403);
    });

    it("should deny registration without token", async () => {
      const res = await request.post("/api/auth/register").send({
        name: "No Token",
        email: "notoken@test.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
    });

    it("should fail validation with missing name", async () => {
      const { token } = createTestAuth("admin");

      const res = await request
        .post("/api/auth/register")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "valid@test.com",
          password: "password123",
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe("POST /api/auth/reset-password", () => {
    it("should reset password (admin only)", async () => {
      const { token } = createTestAuth("admin");
      const user = await User.create({
        name: "Reset User",
        email: "reset@test.com",
        password: await bcrypt.hash("oldpassword", 10),
        role: "member",
      });

      const res = await request
        .post("/api/auth/reset-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId: user._id.toString(),
          newPassword: "newpassword123",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password reset successfully.");

      // Verify password was changed
      const updated = await User.findById(user._id);
      const isNewPassword = await bcrypt.compare("newpassword123", updated.password);
      expect(isNewPassword).toBe(true);
    });

    it("should deny reset for non-admin", async () => {
      const { token } = createTestAuth("treasurer");

      const res = await request
        .post("/api/auth/reset-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId: "someid",
          newPassword: "newpassword",
        });

      expect(res.status).toBe(403);
    });
  });
});
