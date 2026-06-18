const { createTestAuth } = require("./setup");
const supertest = require("supertest");
const app = require("../app");
const Transaction = require("../models/transaction.model");
const AuditLog = require("../models/auditLog.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

const request = supertest(app);

describe("Report Endpoints", () => {
  let adminAuth, treasurerAuth, memberAuth;

  beforeEach(() => {
    adminAuth = createTestAuth("admin");
    treasurerAuth = createTestAuth("treasurer");
    memberAuth = createTestAuth("member");
  });

  describe("GET /api/reports/statement", () => {
    it("should return financial statement", async () => {
      await Transaction.create([
        { type: "cash_in", category: "offering", amount: 10000, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_in", category: "tithe", amount: 5000, source: "mpesa", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_out", category: "food", amount: 3000, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_out", category: "transport", amount: 2000, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
      ]);

      const res = await request
        .get("/api/reports/statement")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.breakdown).toBeDefined();
      expect(res.body.summary).toBeDefined();
      expect(res.body.summary.total_income).toBe(15000);
      expect(res.body.summary.total_expenses).toBe(5000);
      expect(res.body.summary.net_balance).toBe(10000);
    });

    it("should filter by date range", async () => {
      await Transaction.create([
        { type: "cash_in", amount: 5000, source: "cash", recorded_by: new mongoose.Types.ObjectId(), createdAt: new Date("2026-01-15") },
        { type: "cash_in", amount: 8000, source: "cash", recorded_by: new mongoose.Types.ObjectId(), createdAt: new Date("2026-06-15") },
      ]);

      const res = await request
        .get("/api/reports/statement?startDate=2026-01-01&endDate=2026-02-01")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.summary.total_income).toBe(5000);
    });

    it("should return zero summary when no transactions", async () => {
      const res = await request
        .get("/api/reports/statement")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body.summary.total_income).toBe(0);
      expect(res.body.summary.total_expenses).toBe(0);
      expect(res.body.summary.net_balance).toBe(0);
    });

    it("should deny member from viewing statements", async () => {
      const res = await request
        .get("/api/reports/statement")
        .set("Authorization", `Bearer ${memberAuth.token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/reports/categories", () => {
    it("should return category breakdown for cash_in", async () => {
      await Transaction.create([
        { type: "cash_in", category: "offering", amount: 5000, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_in", category: "offering", amount: 3000, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_in", category: "tithe", amount: 4000, source: "mpesa", recorded_by: new mongoose.Types.ObjectId() },
        { type: "cash_out", category: "food", amount: 2000, source: "cash", recorded_by: new mongoose.Types.ObjectId() },
      ]);

      const res = await request
        .get("/api/reports/categories")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2); // Only cash_in categories

      const offering = res.body.find((c) => c._id === "offering");
      expect(offering.total).toBe(8000);
      expect(offering.count).toBe(2);

      const tithe = res.body.find((c) => c._id === "tithe");
      expect(tithe.total).toBe(4000);
      expect(tithe.count).toBe(1);
    });

    it("should deny member from viewing categories", async () => {
      const res = await request
        .get("/api/reports/categories")
        .set("Authorization", `Bearer ${memberAuth.token}`);

      expect(res.status).toBe(403);
    });
  });
});

describe("Audit Log Endpoints", () => {
  let adminAuth, treasurerAuth;

  beforeEach(() => {
    adminAuth = createTestAuth("admin");
    treasurerAuth = createTestAuth("treasurer");
  });

  describe("GET /api/audit-logs", () => {
    it("should return audit logs (admin only)", async () => {
      const user = await User.create({
        name: "Logger",
        email: "logger@test.com",
        password: "hashed",
        role: "admin",
      });

      await AuditLog.create([
        { user_id: user._id, action: "create", entity: "transactions", entity_id: new mongoose.Types.ObjectId() },
        { user_id: user._id, action: "update", entity: "assets", entity_id: new mongoose.Types.ObjectId() },
      ]);

      const res = await request
        .get("/api/audit-logs")
        .set("Authorization", `Bearer ${adminAuth.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].action).toBeDefined();
      expect(res.body[0].entity).toBeDefined();
    });

    it("should deny non-admin from viewing audit logs", async () => {
      const res = await request
        .get("/api/audit-logs")
        .set("Authorization", `Bearer ${treasurerAuth.token}`);

      expect(res.status).toBe(403);
    });
  });
});
