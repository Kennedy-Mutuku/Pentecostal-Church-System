// Idempotent seed for every admin-level login account.
// Safe to run repeatedly, and on both the local dev DB and the VPS production DB —
// it always upserts these exact emails/passwords, so credentials never drift between environments.
//
// Usage: node scripts/seedAllAccessAccounts.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SuperAdmin = require('../models/superAdmin');
const AdmissionAdmin = require('../models/admissionAdmin');
const Patron = require('../models/patron');
const FinanceUser = require('../models/financeUser');
const Overseer = require('../models/overseer');

const accounts = [
  { model: SuperAdmin, match: { email: 'admin@rpcmcsuperadmin.co.ke' }, data: { email: 'admin@rpcmcsuperadmin.co.ke', phone: '+254700000000' }, password: 'newsAdmin01q7' },
  { model: AdmissionAdmin, match: { email: 'admin@rpcadmissionadmin.org' }, data: { email: 'admin@rpcadmissionadmin.org', phone: '0700000001' }, password: 'AdmissionAdmin' },
  { model: Patron, match: { email: 'admin@rpcpastor.org' }, data: { email: 'admin@rpcpastor.org' }, password: 'SeniourPastor' },
  { model: FinanceUser, match: { email: 'admin@rpctreasurer.org' }, data: { name: 'Church Treasurer', email: 'admin@rpctreasurer.org', role: 'treasurer' }, password: 'Treasurer' },
  { model: Overseer, match: { email: 'overseer@rpc-nyamira.co.ke' }, data: { email: 'overseer@rpc-nyamira.co.ke' }, password: 'Overseer@2026' },
];

async function seed() {
  const dbUri = process.env.DB_CONNECTION_URI || 'mongodb://127.0.0.1:27017/rpc-nyamira';
  await mongoose.connect(dbUri);
  console.log('Connected to MongoDB:', dbUri.replace(/\/\/.*@/, '//<redacted>@'));

  for (const { model, match, data, password } of accounts) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await model.findOneAndUpdate(
      match,
      { $set: { ...data, password: hashedPassword } },
      { upsert: true, new: true }
    );
    console.log(`Seeded ${model.modelName}: ${data.email} / ${password}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
