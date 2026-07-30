require('dotenv').config();
const mongoose = require('mongoose');
const Patron = require('../models/patron');

const ASSISTANT_PATRON_EMAILS = [
    'assistantpatron@rpc-nyamira.co.ke',
    'assistantpatron@ksucu-mc.co.ke',
];

async function deleteAssistantPatronAccounts() {
    try {
        const dbUri = process.env.DB_CONNECTION_URI || 'mongodb://127.0.0.1:27017/rpc-nyamira';
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        const result = await Patron.deleteMany({ email: { $in: ASSISTANT_PATRON_EMAILS } });
        console.log(`Deleted ${result.deletedCount} assistant patron account(s).`);

        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

deleteAssistantPatronAccounts();
