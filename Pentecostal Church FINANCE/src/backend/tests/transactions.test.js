const { createTestAuth } = require("./setup");
const supertest = require("supertest");
const app = require("../app");
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

const request = supertest(app);

describe("Transaction Endpoints", () => {
  let treasurerAuth, adminAuth, memberAuth, auditorAuth;

  beforeEach(() => {
    treasurerAuth = createTestAuth("treasurer");
    adminAuth = createTestAuth("admin");
    memberAuth = createTestAuth("member");
    auditorAuth = createTestAuth("auditor");
  });

  describe("POST /api/transactions", () => {
    it("should create a transaction (treasurer)", async () => {
      const res = await request
        .post("/api/transactions")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          type: "cash_in",
          category: "offering",
          amount: 5000,
          source: "mpesa",
          phone: "0712345678",
          description: "Sunday offering",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Transaction recorded.");
      expect(res.body.id).toBeDefined();

      const tx = await Transaction.findById(res.body.id);
      expect(tx.amount).toBe(5000);
      expect(tx.type).toBe("cash_in");
      expect(tx.source).toBe("mpesa");
    });

    it("should deny non-treasurer from creating transactions", async () => {
      const res = await request
        .post("/api/transactions")
        .set("Authorization", `Bearer ${adminAuth.token}`)
        .send({
          type: "cash_in",
          amount: 1000,
          source: "cash",
        });

      expect(res.status).toBe(403);
    });

    it("should fail validation with missing amount", async () => {
      const res = await request
        .post("/api/transactions")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          type: "cash_in",
          source: "cash",
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("should fail validation with invalid type", async () => {
      const res = await request
        .post("/api/transactions")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          type: "invalid_type",
          amount: 1000,
          source: "cash",
        });

      expect(res.status).toBe(400);
    });

    it("should fail validation with invalid source", async () => {
      const res = await request
        .post("/api/transactions")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          type: "cash_in",
          amount: 1000,
          source: "cheque",
        });

      expect(res.status).toBe(400);
    });

    it("should fail validation with invalid category", async () => {
      const res = await request
        .post("/api/transactions")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({
          type: "cash_in",
          amount: 1000,
          source: "cash",
          category: "invalid_cat",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/transactions", () => {
    it("should return all transactions for authorized roles", async () => {
      await Transaction.create([
        { type: "cash_in", amount: 1000, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_out", amount: 500, source: "mpesa", recorded_by: new mongoose.Types.ObjectId() },
      ]);

      const res = await request
        .get("/api/transactions")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("should filter by type", async () => {
      await Transaction.create([
        { type: "cash_in", amount: 1000, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_out", amount: 500, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
      ]);

      const res = await request
        .get("/api/transactions?type=cash_in")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].type).toBe("cash_in");
    });

    it("should filter by category", async () => {
      await Transaction.create([
        { type: "cash_in", amount: 1000, source: "cash", category: "offering", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_in", amount: 2000, source: "cash", category: "tithe", recorded_by: new mongoose.Types.ObjectId() },
      ]);

      const res = await request
        .get("/api/transactions?category=tithe")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].category).toBe("tithe");
    });

    it("should filter by date range", async () => {
      await Transaction.create([
        { type: "cash_in", amount: 1000, source: "cash", recorded_by: new mongoose.Types.ObjectId(), createdAt: new Date("2026-01-01") },
        { type: "cash_in", amount: 2000, source: "cash", recorded_by: new mongoose.Types.ObjectId(), createdAt: new Date("2026-06-01") },
      ]);

      const res = await request
        .get("/api/transactions?startDate=2025-12-01&endDate=2026-02-01")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it("should deny member from viewing transactions", async () => {
      const res = await request
        .get("/api/transactions")
        .set("Authorization", `Bearer ${memberAuth.token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/transactions/:id", () => {
    it("should return a single transaction", async () => {
      const tx = await Transaction.create({
        type: "cash_in",
        amount: 3000,
        source: "mpesa",
        recorded_by: new mongoose.Types.ObjectId(),
      });

      const res = await request
        .get(`/api/transactions/${tx._id}`)
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.amount).toBe(3000);
    });

    it("should return 404 for non-existent transaction", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request
        .get(`/api/transactions/${fakeId}`)
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/transactions/my-contributions", () => {
    it("should return only user's cash_in transactions", async () => {
      const userId = new mongoose.Types.ObjectId(memberAuth.user.id);
      const otherId = new mongoose.Types.ObjectId();

      await Transaction.create([
        { type: "cash_in", amount: 1000, source: "cash", recorded_by: userId },
        { type: "cash_in", amount: 2000, source: "cash", recorded_by: otherId },
        { type: "cash_out", amount: 500, source: "cash", recorded_by: userId },
      ]);

      const res = await request
        .get("/api/transactions/my-contributions")
        .set("Authorization", `Bearer ${memberAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].amount).toBe(1000);
    });
  });

  describe("GET /api/transactions/balance", () => {
    it("should return correct balance", async () => {
      await Transaction.create([
        { type: "cash_in", amount: 10000, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_in", amount: 5000, source: "mpesa", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_out", amount: 3000, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
      ]);

      const res = await request
        .get("/api/transactions/balance")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.total_in).toBe(15000);
      expect(res.body.total_out).toBe(3000);
      expect(res.body.balance).toBe(12000);
    });

    it("should return zero balance when no transactions", async () => {
      const res = await request
        .get("/api/transactions/balance")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.total_in).toBe(0);
      expect(res.body.total_out).toBe(0);
      expect(res.body.balance).toBe(0);
    });
  });
});
