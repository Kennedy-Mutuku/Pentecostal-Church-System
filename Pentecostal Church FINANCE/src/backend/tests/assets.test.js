const { createTestAuth } = require("./setup");
const supertest = require("supertest");
const app = require("../app");
const Asset = require("../models/asset.model");
const mongoose = require("mongoose");

const request = supertest(app);

describe("Asset Endpoints", () => {
  let treasurerAuth, adminAuth, auditorAuth, memberAuth;

  beforeEach(() => {
    treasurerAuth = createTestAuth("treasurer");
    adminAuth = createTestAuth("admin");
    auditorAuth = createTestAuth("auditor");
    memberAuth = createTestAuth("member");
  });

  describe("POST /api/assets", () => {
    it("should create an asset (treasurer)", async () => {
      const res = await request
        .post("/api/assets")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          name: "PA System",
          description: "Sound system for events",
          valuation: 50000,
          condition: "new",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Asset recorded.");
      expect(res.body.id).toBeDefined();

      const asset = await Asset.findById(res.body.id);
      expect(asset.name).toBe("PA System");
      expect(asset.valuation).toBe(50000);
      expect(asset.condition).toBe("new");
    });

    it("should deny non-treasurer from creating assets", async () => {
      const res = await request
        .post("/api/assets")
        .set("Authorization", `Bearer ${adminAuth.token}`)
        .send({
          name: "Chair",
          valuation: 2000,
        });

      expect(res.status).toBe(403);
    });

    it("should fail validation with missing name", async () => {
      const res = await request
        .post("/api/assets")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          valuation: 5000,
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("should fail validation with missing valuation", async () => {
      const res = await request
        .post("/api/assets")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          name: "Table",
        });

      expect(res.status).toBe(400);
    });

    it("should fail validation with invalid condition", async () => {
      const res = await request
        .post("/api/assets")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          name: "Desk",
          valuation: 3000,
          condition: "broken",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/assets", () => {
    it("should return all assets", async () => {
      await Asset.create([
        { name: "Projector", valuation: 30000, recorded_by: new mongoose.Types.ObjectId() },
        { name: "Whiteboard", valuation: 5000, recorded_by: new mongoose.Types.ObjectId() },
      ]);

      const res = await request
        .get("/api/assets")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("should allow auditor to view assets", async () => {
      await Asset.create({ name: "Mic", valuation: 3000, recorded_by: new mongoose.Types.ObjectId() });

      const res = await request
        .get("/api/assets")
        .set("Authorization", `Bearer ${auditorAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it("should deny member from viewing assets", async () => {
      const res = await request
        .get("/api/assets")
        .set("Authorization", `Bearer ${memberAuth.token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/assets/:id", () => {
    it("should return a single asset", async () => {
      const asset = await Asset.create({
        name: "Speaker",
        valuation: 15000,
        recorded_by: new mongoose.Types.ObjectId(),
      });

      const res = await request
        .get(`/api/assets/${asset._id}`)
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Speaker");
    });

    it("should return 404 for non-existent asset", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request
        .get(`/api/assets/${fakeId}`)
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/assets/:id", () => {
    it("should update an asset (treasurer)", async () => {
      const asset = await Asset.create({
        name: "Old Projector",
        valuation: 20000,
        condition: "fair",
        recorded_by: new mongoose.Types.ObjectId(),
      });

      const res = await request
        .put(`/api/assets/${asset._id}`)
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          name: "Updated Projector",
          valuation: 25000,
          condition: "good",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Asset updated.");

      const updated = await Asset.findById(asset._id);
      expect(updated.name).toBe("Updated Projector");
      expect(updated.valuation).toBe(25000);
    });

    it("should deny admin from updating assets", async () => {
      const asset = await Asset.create({
        name: "Test",
        valuation: 1000,
        recorded_by: new mongoose.Types.ObjectId(),
      });

      const res = await request
        .put(`/api/assets/${asset._id}`)
        .set("Authorization", `Bearer ${adminAuth.token}`)
        .send({ name: "Changed" });

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /api/assets/:id", () => {
    it("should delete an asset (admin only)", async () => {
      const asset = await Asset.create({
        name: "To Delete",
        valuation: 1000,
        recorded_by: new mongoose.Types.ObjectId(),
      });

      const res = await request
        .delete(`/api/assets/${asset._id}`)
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Asset deleted.");

      const deleted = await Asset.findById(asset._id);
      expect(deleted).toBeNull();
    });

    it("should deny treasurer from deleting assets", async () => {
      const asset = await Asset.create({
        name: "Keep",
        valuation: 5000,
        recorded_by: new mongoose.Types.ObjectId(),
      });

      const res = await request
        .delete(`/api/assets/${asset._id}`)
        .set("Authorization", `Bearer ${treasurerAuth.token}`);

      expect(res.status).toBe(403);
    });
  });
});
