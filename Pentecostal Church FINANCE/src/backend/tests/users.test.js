const { createTestAuth } = require("./setup");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const request = supertest(app);

describe("User Management Endpoints", () => {
  let adminAuth, treasurerAuth, memberAuth;

  beforeEach(() => {
    adminAuth = createTestAuth("admin");
    treasurerAuth = createTestAuth("treasurer");
    memberAuth = createTestAuth("member");
  });

  describe("GET /api/users", () => {
    it("should return all users without passwords (admin)", async () => {
      await User.create([
        { name: "User 1", email: "u1@test.com", password: "hashed1", role: "member" },
        { name: "User 2", email: "u2@test.com", password: "hashed2", role: "treasurer" },
      ]);

      const res = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      // Verify passwords are excluded
      res.body.forEach((user) => {
        expect(user.password).toBeUndefined();
      });
    });

    it("should deny non-admin from viewing users", async () => {
      const res = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${treasurerAuth.token}`);

      expect(res.status).toBe(403);
    });

    it("should deny unauthenticated request", async () => {
      const res = await request.get("/api/users");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a single user without password", async () => {
      const user = await User.create({
        name: "Find Me",
        email: "find@test.com",
        password: "hashed",
        role: "member",
      });

      const res = await request
        .get(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Find Me");
      expect(res.body.password).toBeUndefined();
    });

    it("should return 404 for non-existent user", async () => {
      const fakeId = new (require("mongoose").Types.ObjectId)();
      const res = await request
        .get(`/api/users/${fakeId}`)
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update user details", async () => {
      const user = await User.create({
        name: "Old Name",
        email: "old@test.com",
        password: "hashed",
        role: "member",
      });

      const res = await request
        .put(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${adminAuth.token}`)
        .send({
          name: "New Name",
          email: "new@test.com",
          role: "treasurer",
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("New Name");
      expect(res.body.email).toBe("new@test.com");
      expect(res.body.role).toBe("treasurer");
    });

    it("should reject duplicate email", async () => {
      await User.create({
        name: "Existing",
        email: "taken@test.com",
        password: "hashed",
        role: "member",
      });
      const user = await User.create({
        name: "To Update",
        email: "original@test.com",
        password: "hashed",
        role: "member",
      });

      const res = await request
        .put(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${adminAuth.token}`)
        .send({ email: "taken@test.com" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email already in use.");
    });

    it("should allow updating to same email", async () => {
      const user = await User.create({
        name: "Same Email",
        email: "same@test.com",
        password: "hashed",
        role: "member",
      });

      const res = await request
        .put(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${adminAuth.token}`)
        .send({ name: "Updated Name", email: "same@test.com" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Updated Name");
    });

    it("should return 404 for non-existent user", async () => {
      const fakeId = new (require("mongoose").Types.ObjectId)();
      const res = await request
        .put(`/api/users/${fakeId}`)
        .set("Authorization", `Bearer ${adminAuth.token}`)
        .send({ name: "Ghost" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete a user", async () => {
      const user = await User.create({
        name: "Delete Me",
        email: "delete@test.com",
        password: "hashed",
        role: "member",
      });

      const res = await request
        .delete(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User deleted.");

      const deleted = await User.findById(user._id);
      expect(deleted).toBeNull();
    });

    it("should deny non-admin from deleting users", async () => {
      const user = await User.create({
        name: "Safe",
        email: "safe@test.com",
        password: "hashed",
        role: "member",
      });

      const res = await request
        .delete(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${memberAuth.token}`);

      expect(res.status).toBe(403);
    });
  });
});
