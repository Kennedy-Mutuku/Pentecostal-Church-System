require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Patron = require('../models/patron');

async function updatePatronCredentials() {
    try {
        const dbUri = process.env.DB_CONNECTION_URI || 'mongodb://127.0.0.1:27017/rpc-nyamira';
        await mongoose.connect(dbUri);
        console.log('Connected to MongoDB');

        // Remove all old patron records
        const deleted = await Patron.deleteMany({});
        console.log(`Deleted ${deleted.deletedCount} old patron record(s)`);

        // Create fresh patron with new credentials
        const hashedPassword = await bcrypt.hash('SeniourPastor', 10);
        await new Patron({ email: 'admin@rpcpastor.org', password: hashedPassword }).save();
        console.log('✅ New patron created: admin@rpcpastor.org');

        // Verify password
        const saved = await Patron.findOne({ email: 'admin@rpcpastor.org' });
        const valid = await bcrypt.compare('SeniourPastor', saved.password);
        console.log('Password verification:', valid ? 'PASS ✓' : 'FAIL ✗');

        console.log('\nNew credentials:');
        console.log('  Email:    admin@rpcpastor.org');
        console.log('  Password: SeniourPastor');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed');
    }
}

updatePatronCredentials();
