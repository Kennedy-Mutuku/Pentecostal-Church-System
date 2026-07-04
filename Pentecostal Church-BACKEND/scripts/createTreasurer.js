require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const FinanceUser = require('../models/financeUser');

async function createTreasurer() {
    try {
        const dbUri = process.env.DB_CONNECTION_URI || 'mongodb://127.0.0.1:27017/rpc-nyamira';
        await mongoose.connect(dbUri);
        
        const email = 'treasurer@ksucu.ac.ke';
        const password = 'Treasurer@2026';
        
        const existingUser = await FinanceUser.findOne({ email });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        if (existingUser) {
            existingUser.password = hashedPassword;
            existingUser.role = 'treasurer';
            await existingUser.save();
            console.log('Treasurer updated successfully');
        } else {
            const newUser = new FinanceUser({
                email,
                password: hashedPassword,
                role: 'treasurer',
                name: 'Treasurer'
            });
            await newUser.save();
            console.log('Treasurer created successfully');
        }
        
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createTreasurer();
