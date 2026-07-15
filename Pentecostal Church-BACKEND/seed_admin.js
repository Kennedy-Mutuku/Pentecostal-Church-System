const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const superAdminSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true }
});

const sAdmin = mongoose.model('SuperAdmin', superAdminSchema, 'superadmins');

async function seedAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/rpc-nyamira', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const result = await sAdmin.findOneAndUpdate(
            { email: 'admin@rikurumachurch.com' },
            { 
                $set: { 
                    email: 'admin@rikurumachurch.com',
                    phone: '0712345678',
                    password: hashedPassword 
                } 
            },
            { upsert: true, new: true }
        );

        console.log('Admin user updated/created:', result);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedAdmin();
