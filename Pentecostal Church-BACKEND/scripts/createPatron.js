require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Patron = require('../models/patron');

async function upsertPatron(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existing = await Patron.findOne({ email });
    if (existing) {
        existing.password = hashedPassword;
        await existing.save();
        console.log(`✅ Password reset for existing patron: ${email}`);
    } else {
        await new Patron({ email, password: hashedPassword }).save();
        console.log(`✅ Patron created: ${email}`);
    }
}

async function createPatrons() {
    try {
        const dbUri = process.env.DB_CONNECTION_URI || 'mongodb://127.0.0.1:27017/ksucu-mc';
        await mongoose.connect(dbUri);
        console.log('Connected to MongoDB:', dbUri);

        const password = 'Patron@Patron';

        // Seed both email aliases
        await upsertPatron('patron@rpc-nyamira.co.ke', password);
        await upsertPatron('patron@ksucu-mc.co.ke', password);

        console.log('\n🎉 All patron accounts ready!');
        console.log('   Password:', password);

        await mongoose.connection.close();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createPatrons();
