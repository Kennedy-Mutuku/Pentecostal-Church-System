const { createTestAuth } = require("./setup");
const supertest = require("supertest");
const app = require("../app");
const Transaction = require("../models/transaction.model");

const request = supertest(app);

describe("M-Pesa Endpoints", () => {
  let adminAuth, treasurerAuth, memberAuth;

  beforeEach(() => {
    adminAuth = createTestAuth("admin");
    treasurerAuth = createTestAuth("treasurer");
    memberAuth = createTestAuth("member");
  });

  describe("POST /api/mpesa/stkpush", () => {
    it("should reject missing phone", async () => {
      const res = await request
        .post("/api/mpesa/stkpush")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({ amount: 1000 });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Phone and amount are required.");
    });

    it("should reject missing amount", async () => {
      const res = await request
        .post("/api/mpesa/stkpush")
        .set("Authorization", `Bearer ${treasurerAuth.token}`)
        .send({ phone: "0712345678" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Phone and amount are required.");
    });

    it("should deny member from initiating payment", async () => {
      const res = await request
        .post("/api/mpesa/stkpush")
        .set("Authorization", `Bearer ${memberAuth.token}`)
        .send({ phone: "0712345678", amount: 1000 });

      expect(res.status).toBe(403);
    });

    it("should deny unauthenticated request", async () => {
      const res = await request
        .post("/api/mpesa/stkpush")
        .send({ phone: "0712345678", amount: 1000 });

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/mpesa/callback", () => {
    it("should process successful payment callback", async () => {
      const res = await request.post("/api/mpesa/callback").send({
        Body: {
          stkCallback: {
            ResultCode: 0,
            ResultDesc: "The service request is processed successfully.",
            CallbackMetadata: {
              Item: [
                { Name: "Amount", Value: 1500 },
                { Name: "MpesaReceiptNumber", Value: "QHJ3K5L2MN" },
                { Name: "PhoneNumber", Value: 254712345678 },
              ],
            },
          },
        },
      });

      expect(res.status).toBe(200);
      expect(res.body.ResultCode).toBe(0);

      // Verify transaction was auto-created
      const transactions = await Transaction.find({});
      expect(transactions).toHaveLength(1);
      expect(transactions[0].type).toBe("cash_in");
      expect(transactions[0].amount).toBe(1500);
      expect(transactions[0].source).toBe("mpesa");
      expect(transactions[0].phone).toBe("254712345678");
    });

    it("should handle failed payment callback", async () => {
      const res = await request.post("/api/mpesa/callback").send({
        Body: {
          stkCallback: {
            ResultCode: 1032,
            ResultDesc: "Request cancelled by user.",
          },
        },
      });

      expect(res.status).toBe(200);
      expect(res.body.ResultCode).toBe(0);

      // No transaction should be created
      const transactions = await Transaction.find({});
      expect(transactions).toHaveLength(0);
    });

    it("should handle invalid callback body", async () => {
      const res = await request.post("/api/mpesa/callback").send({
        invalid: "data",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid callback.");
    });
  });
});
