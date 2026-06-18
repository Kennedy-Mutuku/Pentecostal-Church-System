const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

let mongoServer;

// Use a smaller MongoDB version for faster downloads
process.env.MONGOMS_VERSION = "7.0.0";
process.env.NODE_ENV = "test";

// Set env vars for tests
process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.MPESA_CONSUMER_KEY = "test-consumer-key";
process.env.MPESA_CONSUMER_SECRET = "test-consumer-secret";
process.env.MPESA_SHORTCODE = "174379";
process.env.MPESA_PASSKEY = "test-passkey";
process.env.MPESA_CALLBACK_URL = "https://test.com/api/mpesa/callback";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 120000); // 2 min timeout for first-time binary extraction

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Helper to generate JWT tokens for testing
function generateToken(userData) {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "24h" });
}

// Helper to create a test user and return token
function createTestAuth(role = "admin", overrides = {}) {
  const userData = {
    id: new mongoose.Types.ObjectId().toString(),
    name: "Test User",
    email: `test-${role}@example.com`,
    role,
    ...overrides,
  };
  const token = generateToken(userData);
  return { user: userData, token };
}

module.exports = { generateToken, createTestAuth };
