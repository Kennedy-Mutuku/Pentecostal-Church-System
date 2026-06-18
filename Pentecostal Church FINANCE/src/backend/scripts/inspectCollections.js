require('dotenv').config();
const mongoose = require('mongoose');

async function inspectData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        const assetsCount = await db.collection('assets').countDocuments();
        const fAssetsCount = await db.collection('finance_assets').countDocuments();
        const txCount = await db.collection('transactions').countDocuments();
        const fTxCount = await db.collection('finance_transactions').countDocuments();
        
        console.log({
            assets: assetsCount,
            finance_assets: fAssetsCount,
            transactions: txCount,
            finance_transactions: fTxCount
        });
        
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}
inspectData();
