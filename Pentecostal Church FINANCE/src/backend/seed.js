require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cu-finance";

const users = [
  {
    name: "Justus Kimutai",
    email: "admin@rpc.ac.ke",
    phone: "0712000001",
    password: "Admin@2026",
    role: "admin",
  },
  {
    name: "Mary Wanjiku",
    email: "treasurer@rpc.ac.ke",
    phone: "0712000002",
    password: "Treasurer@2026",
    role: "treasurer",
  },
  {
    name: "Peter Odhiambo",
    email: "auditor@rpc.ac.ke",
    phone: "0712000003",
    password: "Auditor@2026",
    role: "auditor",
  },
  {
    name: "Grace Akinyi",
    email: "accounts@rpc.ac.ke",
    phone: "0712000004",
    password: "Accounts@2026",
    role: "chair_accounts",
  },
  {
    name: "David Kipchoge",
    email: "chairperson@rpc.ac.ke",
    phone: "0712000005",
    password: "Chair@2026",
    role: "chairperson",
  },
  {
    name: "Rev. Sarah Mutua",
    email: "patron@rpc.ac.ke",
    phone: "0712000006",
    password: "Patron@2026",
    role: "patron",
  },
  {
    name: "Brian Otieno",
    email: "member@rpc.ac.ke",
    phone: "0712000007",
    password: "Member@2026",
    role: "member",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB\n");

    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`  [skip] ${userData.email} already exists (${existing.role})`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({ ...userData, password: hashedPassword });
      console.log(`  [created] ${userData.email} (${userData.role})`);
    }

    console.log("\nDone. You can now log in with the credentials above.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
