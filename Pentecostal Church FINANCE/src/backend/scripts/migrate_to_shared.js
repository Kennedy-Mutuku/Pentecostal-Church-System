require('dotenv').config();
const mongoose = require('mongoose');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        // 1. Migrate Assets
        const assets = await db.collection('assets').find({}).toArray();
        if (assets.length > 0) {
            console.log(`Migrating ${assets.length} assets...`);
            await db.collection('finance_assets').insertMany(assets);
            console.log('Assets migrated.');
        } else {
            console.log('No assets to migrate.');
        }

        // 2. Migrate Transactions
        const txs = await db.collection('transactions').find({}).toArray();
        if (txs.length > 0) {
            console.log(`Migrating ${txs.length} transactions...`);
            await db.collection('finance_transactions').insertMany(txs);
            console.log('Transactions migrated.');
        } else {
            console.log('No transactions to migrate.');
        }

        await mongoose.connection.close();
        console.log('Migration complete.');
    } catch (err) {
        console.error('Migration failed:', err);
    }
}
migrate();
