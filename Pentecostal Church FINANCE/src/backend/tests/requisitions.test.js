const { createTestAuth } = require("./setup");
const supertest = require("supertest");
const app = require("../app");
const Requisition = require("../models/requisition.model");
const mongoose = require("mongoose");

const request = supertest(app);

describe("Requisition Endpoints", () => {
  let treasurerAuth, chairAuth, patronAuth, adminAuth, memberAuth;

  beforeEach(() => {
    treasurerAuth = createTestAuth("treasurer");
    chairAuth = createTestAuth("chairperson");
    patronAuth = createTestAuth("patron");
    adminAuth = createTestAuth("admin");
    memberAuth = createTestAuth("member");
  });

  describe("POST /api/requisitions", () => {
    it("should create a requisition (treasurer)", async () => {
      const res = await request
        .post("/api/requisitions")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          reason: "Purchase office supplies",
          amount_requested: 5000,
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Requisition submitted.");
      expect(res.body.id).toBeDefined();

      const req = await Requisition.findById(res.body.id);
      expect(req.reason).toBe("Purchase office supplies");
      expect(req.amount_requested).toBe(5000);
      expect(req.status).toBe("pending");
    });

    it("should deny non-treasurer from creating requisitions", async () => {
      const res = await request
        .post("/api/requisitions")
        .set("Authorization", `Bearer ${adminAuth.token}`)
        .send({
          reason: "Test",
          amount_requested: 1000,
        });

      expect(res.status).toBe(403);
    });

    it("should fail validation with missing reason", async () => {
      const res = await request
        .post("/api/requisitions")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          amount_requested: 1000,
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("should fail validation with missing amount", async () => {
      const res = await request
        .post("/api/requisitions")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          reason: "Test reason",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/requisitions", () => {
    it("should return all requisitions", async () => {
      await Requisition.create([
        { requested_by: new mongoose.Types.ObjectId(), reason: "R1", amount_requested: 1000 },
        { requested_by: new mongoose.Types.ObjectId(), reason: "R2", amount_requested: 2000 },
      ]);

      const res = await request
        .get("/api/requisitions")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("should filter by status", async () => {
      await Requisition.create([
        { requested_by: new mongoose.Types.ObjectId(), reason: "R1", amount_requested: 1000, status: "pending" },
        { requested_by: new mongoose.Types.ObjectId(), reason: "R2", amount_requested: 2000, status: "approved" },
      ]);

      const res = await request
        .get("/api/requisitions?status=approved")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].status).toBe("approved");
    });

    it("should deny member from viewing requisitions", async () => {
      const res = await request
        .get("/api/requisitions")
        .set("Authorization", `Bearer ${memberAuth.token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/requisitions/:id", () => {
    it("should return a single requisition", async () => {
      const req = await Requisition.create({
        requested_by: new mongoose.Types.ObjectId(),
        reason: "Buy printer",
        amount_requested: 15000,
      });

      const res = await request
        .get(`/api/requisitions/${req._id}`)
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.reason).toBe("Buy printer");
    });

    it("should return 404 for non-existent requisition", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request
        .get(`/api/requisitions/${fakeId}`)
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/requisitions/:id/approve", () => {
    it("should approve a requisition (chairperson)", async () => {
      const req = await Requisition.create({
        requested_by: new mongoose.Types.ObjectId(),
        reason: "Event supplies",
        amount_requested: 3000,
      });

      const res = await request
        .put(`/api/requisitions/${req._id}/approve`)
        .set("Authorization", `Bearer ${chairAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Requisition approved.");

      const updated = await Requisition.findById(req._id);
      expect(updated.status).toBe("approved");
    });

    it("should approve a requisition (patron)", async () => {
      const req = await Requisition.create({
        requested_by: new mongoose.Types.ObjectId(),
        reason: "Books",
        amount_requested: 2000,
      });

      const res = await request
        .put(`/api/requisitions/${req._id}/approve`)
        .set("Authorization", `Bearer ${patronAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Requisition approved.");
    });

    it("should deny treasurer from approving", async () => {
      const req = await Requisition.create({
        requested_by: new mongoose.Types.ObjectId(),
        reason: "Test",
        amount_requested: 1000,
      });

      const res = await request
        .put(`/api/requisitions/${req._id}/approve`)
        .set("Authorization", `Bearer ${treasurerAuth.token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("PUT /api/requisitions/:id/reject", () => {
    it("should reject a requisition (chairperson)", async () => {
      const req = await Requisition.create({
        requested_by: new mongoose.Types.ObjectId(),
        reason: "Rejected item",
        amount_requested: 5000,
      });

      const res = await request
        .put(`/api/requisitions/${req._id}/reject`)
        .set("Authorization", `Bearer ${chairAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Requisition rejected.");

      const updated = await Requisition.findById(req._id);
      expect(updated.status).toBe("rejected");
    });
  });

  describe("PUT /api/requisitions/:id/complete", () => {
    it("should complete a requisition (treasurer)", async () => {
      const req = await Requisition.create({
        requested_by: new mongoose.Types.ObjectId(),
        reason: "Completed item",
        amount_requested: 3000,
        status: "approved",
      });

      const res = await request
        .put(`/api/requisitions/${req._id}/complete`)
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({ amount_spent: 2800 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Requisition completed.");

      const updated = await Requisition.findById(req._id);
      expect(updated.status).toBe("completed");
      expect(updated.amount_spent).toBe(2800);
    });

    it("should deny chairperson from completing", async () => {
      const req = await Requisition.create({
        requested_by: new mongoose.Types.ObjectId(),
        reason: "Test",
        amount_requested: 1000,
        status: "approved",
      });

      const res = await request
        .put(`/api/requisitions/${req._id}/complete`)
        .set("Authorization", `Bearer ${chairAuth.token}`)
        .send({ amount_spent: 900 });

      expect(res.status).toBe(403);
    });
  });
});
