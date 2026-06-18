require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'treasurer@rpc.ac.ke' });
        if (user) {
            console.log('User found:', user.email, 'Role:', user.role);
        } else {
            console.log('User NOT found!');
        }
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}
checkUser();
