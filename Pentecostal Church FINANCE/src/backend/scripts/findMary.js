require('dotenv').config();
const mongoose = require('mongoose');

async function findMary() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const user = await db.collection('finance_users').findOne({ name: /Mary/i });
        const allUsers = await db.collection('finance_users').find({}).toArray();
        console.log('Mary Wanjiku:', user);
        console.log('All Finance Users:', allUsers.map(u => u.name));
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}
findMary();
