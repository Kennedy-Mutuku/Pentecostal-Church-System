require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const FinanceUser = require('../models/financeUser');

async function createTreasurerUser() {
    try {
        const dbUri = process.env.DB_CONNECTION_URI || 'mongodb://127.0.0.1:27017/rpc-nyamira';
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        const email = 'admin@rpctreasurer.org';
        const password = 'Treasurer';
        const name = 'Church Treasurer';
        const role = 'treasurer';

        const existing = await FinanceUser.findOne({ email });
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existing) {
            existing.password = hashedPassword;
            existing.role = role;
            existing.name = name;
            await existing.save();
            console.log('Treasurer account already existed — password/role refreshed.');
        } else {
            await FinanceUser.create({ name, email, password: hashedPassword, role });
            console.log('Treasurer account created successfully!');
        }

        console.log('Email:', email);
        console.log('Password:', password);

        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTreasurerUser();
