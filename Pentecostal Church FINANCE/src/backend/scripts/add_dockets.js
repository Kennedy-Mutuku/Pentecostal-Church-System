const mongoose = require('mongoose');
async function run() {
    await mongoose.connect('mongodb://localhost:27017/rpc-nyamira');
    const db = mongoose.connection.db;
    const result = await db.collection('finance_assets').updateMany(
        { docket: { $exists: false } }, 
        { $set: { docket: 'Other' } }
    );
    console.log(`Updated ${result.modifiedCount} assets with 'Other' docket.`);
    process.exit(0);
}
run();
