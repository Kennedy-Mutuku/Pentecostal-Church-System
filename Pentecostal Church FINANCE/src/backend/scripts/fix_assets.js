require('dotenv').config();
const mongoose = require('mongoose');

async function fix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const result = await db.collection('finance_assets').updateMany(
            { purchase_amount: { $exists: false } },
            [
                { $set: { purchase_amount: "$valuation" } },
                { $set: { purchase_date: "$createdAt" } }
            ]
        );
        console.log(`Updated ${result.modifiedCount} assets.`);
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}
fix();
