require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Transaction = require("./models/transaction.model");
const Requisition = require("./models/requisition.model");
const Asset = require("./models/asset.model");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cu-finance";

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB\n");

    const treasurer = await User.findOne({ role: "treasurer" });
    const chairperson = await User.findOne({ role: "chairperson" });
    const admin = await User.findOne({ role: "admin" });
    const member = await User.findOne({ role: "member" });

    if (!treasurer || !chairperson) {
      console.error("Run seed.js first to create users.");
      process.exit(1);
    }

    // Check if data already seeded
    const txCount = await Transaction.countDocuments();
    if (txCount > 0) {
      console.log(`Database already has ${txCount} transactions. Skipping to avoid duplicates.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log("Seeding transactions for March 2026...\n");

    // --- MARCH 2026 TRANSACTIONS ---
    const transactions = [
      // Week 1 - Sunday 1st March
      { type: "cash_in", category: "offering", amount: 12500, source: "cash", description: "Sunday service offering - 1st March", recorded_by: treasurer._id, createdAt: new Date("2026-03-01T10:00:00") },
      { type: "cash_in", category: "tithe", amount: 8000, source: "mpesa", phone: "0712345678", description: "Tithe - John Mwangi", recorded_by: treasurer._id, createdAt: new Date("2026-03-01T10:30:00") },
      { type: "cash_in", category: "tithe", amount: 5000, source: "mpesa", phone: "0723456789", description: "Tithe - Ann Wambui", recorded_by: treasurer._id, createdAt: new Date("2026-03-01T11:00:00") },
      { type: "cash_in", category: "thanksgiving", amount: 3000, source: "cash", description: "Thanksgiving - successful exams", recorded_by: treasurer._id, createdAt: new Date("2026-03-01T11:15:00") },

      // Week 1 - midweek
      { type: "cash_in", category: "offering", amount: 4200, source: "cash", description: "Wednesday fellowship offering", recorded_by: treasurer._id, createdAt: new Date("2026-03-04T18:00:00") },
      { type: "cash_out", category: "food", amount: 2500, source: "cash", description: "Snacks for Wednesday fellowship", recorded_by: treasurer._id, createdAt: new Date("2026-03-04T15:00:00") },
      { type: "cash_out", category: "transport", amount: 1000, source: "mpesa", phone: "0734567890", description: "Transport for guest speaker", recorded_by: treasurer._id, createdAt: new Date("2026-03-04T17:00:00") },

      // Week 2 - Sunday 8th March
      { type: "cash_in", category: "offering", amount: 15800, source: "cash", description: "Sunday service offering - 8th March", recorded_by: treasurer._id, createdAt: new Date("2026-03-08T10:00:00") },
      { type: "cash_in", category: "tithe", amount: 10000, source: "mpesa", phone: "0745678901", description: "Tithe - Grace Atieno", recorded_by: treasurer._id, createdAt: new Date("2026-03-08T10:45:00") },
      { type: "cash_in", category: "tithe", amount: 3500, source: "cash", description: "Tithe - Peter Kamau", recorded_by: treasurer._id, createdAt: new Date("2026-03-08T11:00:00") },
      { type: "cash_in", category: "aob", amount: 6000, source: "mpesa", phone: "0756789012", description: "Missions fund contribution", recorded_by: treasurer._id, createdAt: new Date("2026-03-08T11:30:00") },

      // Week 2 - expenses
      { type: "cash_out", category: "bills", amount: 3000, source: "mpesa", phone: "0711222333", description: "Printing Sunday bulletins & flyers", recorded_by: treasurer._id, createdAt: new Date("2026-03-09T09:00:00") },
      { type: "cash_out", category: "transport", amount: 2000, source: "mpesa", phone: "0722333444", description: "Transport for hospital visit team", recorded_by: treasurer._id, createdAt: new Date("2026-03-10T14:00:00") },

      // Week 2 - midweek
      { type: "cash_in", category: "offering", amount: 3800, source: "cash", description: "Wednesday fellowship offering", recorded_by: treasurer._id, createdAt: new Date("2026-03-11T18:00:00") },
      { type: "cash_out", category: "food", amount: 1800, source: "cash", description: "Tea and snacks for Bible study", recorded_by: treasurer._id, createdAt: new Date("2026-03-11T16:00:00") },

      // Week 3 - Sunday 15th March
      { type: "cash_in", category: "offering", amount: 18200, source: "cash", description: "Sunday service offering - 15th March (Special service)", recorded_by: treasurer._id, createdAt: new Date("2026-03-15T10:00:00") },
      { type: "cash_in", category: "tithe", amount: 12000, source: "mpesa", phone: "0767890123", description: "Tithe - David Ochieng", recorded_by: treasurer._id, createdAt: new Date("2026-03-15T10:30:00") },
      { type: "cash_in", category: "tithe", amount: 7000, source: "cash", description: "Tithe - Mary Njeri", recorded_by: treasurer._id, createdAt: new Date("2026-03-15T11:00:00") },
      { type: "cash_in", category: "thanksgiving", amount: 5000, source: "mpesa", phone: "0778901234", description: "Thanksgiving - new job blessing", recorded_by: treasurer._id, createdAt: new Date("2026-03-15T11:15:00") },
      { type: "cash_in", category: "aob", amount: 8500, source: "cash", description: "Easter camp registration fees", recorded_by: treasurer._id, createdAt: new Date("2026-03-15T11:30:00") },

      // Week 3 - expenses
      { type: "cash_out", category: "others", amount: 5000, source: "mpesa", phone: "0733444555", description: "PA system repair", recorded_by: treasurer._id, createdAt: new Date("2026-03-16T10:00:00") },
      { type: "cash_out", category: "food", amount: 4500, source: "cash", description: "Lunch for leadership meeting", recorded_by: treasurer._id, createdAt: new Date("2026-03-16T12:00:00") },
      { type: "cash_out", category: "bills", amount: 2000, source: "mpesa", phone: "0744555666", description: "Internet subscription for office", recorded_by: treasurer._id, createdAt: new Date("2026-03-17T09:00:00") },

      // Week 3 - midweek
      { type: "cash_in", category: "offering", amount: 5100, source: "cash", description: "Wednesday fellowship offering", recorded_by: treasurer._id, createdAt: new Date("2026-03-18T18:00:00") },
      { type: "cash_out", category: "food", amount: 2200, source: "cash", description: "Snacks for midweek service", recorded_by: treasurer._id, createdAt: new Date("2026-03-18T16:00:00") },

      // Week 4 - Sunday 22nd March
      { type: "cash_in", category: "offering", amount: 14000, source: "cash", description: "Sunday service offering - 22nd March", recorded_by: treasurer._id, createdAt: new Date("2026-03-22T10:00:00") },
      { type: "cash_in", category: "tithe", amount: 6500, source: "mpesa", phone: "0789012345", description: "Tithe - Samuel Kiptoo", recorded_by: treasurer._id, createdAt: new Date("2026-03-22T10:30:00") },
      { type: "cash_in", category: "tithe", amount: 4000, source: "cash", description: "Tithe - Ruth Chebet", recorded_by: treasurer._id, createdAt: new Date("2026-03-22T11:00:00") },
      { type: "cash_in", category: "thanksgiving", amount: 2000, source: "cash", description: "Thanksgiving - birthday celebration", recorded_by: treasurer._id, createdAt: new Date("2026-03-22T11:10:00") },
      { type: "cash_in", category: "aob", amount: 3500, source: "mpesa", phone: "0790123456", description: "Easter camp contribution", recorded_by: treasurer._id, createdAt: new Date("2026-03-22T11:20:00") },

      // Week 4 - expenses
      { type: "cash_out", category: "transport", amount: 3500, source: "mpesa", phone: "0755666777", description: "Transport for outreach team to Nakuru", recorded_by: treasurer._id, createdAt: new Date("2026-03-22T14:00:00") },
      { type: "cash_out", category: "food", amount: 6000, source: "cash", description: "Food for outreach event", recorded_by: treasurer._id, createdAt: new Date("2026-03-22T08:00:00") },
      { type: "cash_out", category: "others", amount: 1500, source: "cash", description: "Stationery and markers", recorded_by: treasurer._id, createdAt: new Date("2026-03-23T09:00:00") },
      { type: "cash_out", category: "bills", amount: 1200, source: "mpesa", phone: "0766777888", description: "Airtime for coordinators", recorded_by: treasurer._id, createdAt: new Date("2026-03-23T10:00:00") },
    ];

    const created = await Transaction.insertMany(transactions);
    console.log(`  [created] ${created.length} transactions\n`);

    // --- REQUISITIONS ---
    console.log("Seeding requisitions...\n");

    const req1 = await Requisition.create({
      requested_by: treasurer._id,
      reason: "Purchase 50 chairs for the new fellowship hall",
      amount_requested: 25000,
      status: "approved",
      approved_by: chairperson._id,
      createdAt: new Date("2026-03-05T09:00:00"),
    });
    console.log("  [created] Requisition: 50 chairs (approved)");

    const req2 = await Requisition.create({
      requested_by: treasurer._id,
      reason: "Easter camp venue booking deposit",
      amount_requested: 15000,
      status: "completed",
      amount_spent: 14500,
      approved_by: chairperson._id,
      createdAt: new Date("2026-03-10T11:00:00"),
    });
    console.log("  [created] Requisition: Easter camp venue (completed, spent 14,500)");

    const req3 = await Requisition.create({
      requested_by: treasurer._id,
      reason: "New projector for Sunday services",
      amount_requested: 45000,
      status: "pending",
      createdAt: new Date("2026-03-20T14:00:00"),
    });
    console.log("  [created] Requisition: New projector (pending approval)");

    const req4 = await Requisition.create({
      requested_by: treasurer._id,
      reason: "Purchase branded CU t-shirts (30 pieces)",
      amount_requested: 18000,
      status: "rejected",
      approved_by: chairperson._id,
      createdAt: new Date("2026-03-12T10:00:00"),
    });
    console.log("  [created] Requisition: CU t-shirts (rejected)");

    // --- ASSETS ---
    console.log("\nSeeding assets...\n");

    const assets = [
      { name: "Yamaha PA System", description: "Portable PA system with 2 speakers and mixer", valuation: 65000, condition: "good", recorded_by: treasurer._id, createdAt: new Date("2026-01-15") },
      { name: "Epson Projector", description: "Epson EB-X51 for Sunday presentations", valuation: 42000, condition: "good", recorded_by: treasurer._id, createdAt: new Date("2026-01-15") },
      { name: "Acoustic Guitar", description: "Fender acoustic guitar for worship team", valuation: 15000, condition: "fair", recorded_by: treasurer._id, createdAt: new Date("2026-02-01") },
      { name: "Keyboard (Casio CTK-3500)", description: "Electronic keyboard for worship", valuation: 28000, condition: "good", recorded_by: treasurer._id, createdAt: new Date("2026-02-01") },
      { name: "Whiteboard (6x4 ft)", description: "Large whiteboard for Bible study sessions", valuation: 4500, condition: "new", recorded_by: treasurer._id, createdAt: new Date("2026-03-01") },
      { name: "Plastic Chairs (20 pcs)", description: "Stackable chairs for fellowship events", valuation: 10000, condition: "good", recorded_by: treasurer._id, createdAt: new Date("2026-02-15") },
      { name: "Bible Study Books (50 copies)", description: "Purpose Driven Life study guides", valuation: 7500, condition: "new", recorded_by: treasurer._id, createdAt: new Date("2026-03-10") },
      { name: "Banner Stand", description: "Roll-up banner stand for events", valuation: 3500, condition: "good", recorded_by: treasurer._id, createdAt: new Date("2026-03-05") },
    ];

    const createdAssets = await Asset.insertMany(assets);
    console.log(`  [created] ${createdAssets.length} assets\n`);

    // --- SUMMARY ---
    const cashIn = transactions.filter(t => t.type === "cash_in").reduce((s, t) => s + t.amount, 0);
    const cashOut = transactions.filter(t => t.type === "cash_out").reduce((s, t) => s + t.amount, 0);

    console.log("=== MARCH 2026 SUMMARY ===");
    console.log(`Total Income:    KES ${cashIn.toLocaleString()}`);
    console.log(`Total Expenses:  KES ${cashOut.toLocaleString()}`);
    console.log(`Net Balance:     KES ${(cashIn - cashOut).toLocaleString()}`);
    console.log(`Transactions:    ${transactions.length}`);
    console.log(`Requisitions:    4 (1 pending, 1 approved, 1 completed, 1 rejected)`);
    console.log(`Assets:          ${assets.length}`);
    console.log("\nDone.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seedData();
