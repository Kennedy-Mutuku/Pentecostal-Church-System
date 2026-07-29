const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdmissionAdmin = require('../models/admissionAdmin');
require('dotenv').config();

const checkAndFix = async () => {
  try {
    const dbUri = process.env.DB_CONNECTION_URI || 'mongodb://127.0.0.1:27017/rpc-nyamira';
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // List all admission admins
    const allAdmins = await AdmissionAdmin.find({});
    console.log('All admission admins in DB:', JSON.stringify(allAdmins.map(a => ({ _id: a._id, email: a.email })), null, 2));

    // Delete all and recreate fresh with correct credentials
    await AdmissionAdmin.deleteMany({});
    console.log('Deleted all existing admission admins');

    const hashedPassword = await bcrypt.hash('AdmissionAdmin', 10);
    const newAdmin = new AdmissionAdmin({
      email: 'admin@rpcadmissionadmin.org',
      password: hashedPassword,
      phone: '0700000001',
    });
    await newAdmin.save();

    console.log('\nFresh admission admin created!');
    console.log('Email:    admin@rpcadmissionadmin.org');
    console.log('Password: AdmissionAdmin');

    // Verify by testing bcrypt compare
    const saved = await AdmissionAdmin.findOne({ email: 'admin@rpcadmissionadmin.org' });
    const valid = await bcrypt.compare('AdmissionAdmin', saved.password);
    console.log('\nPassword verification test:', valid ? 'PASS ✓' : 'FAIL ✗');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
};

checkAndFix();
