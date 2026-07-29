require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdmissionAdmin = require('./models/admissionAdmin');

async function resetPassword() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_URI);
    const password = 'Password@2026';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await AdmissionAdmin.updateOne(
      { email: 'admin@rpcmcadmissionadmin.co.ke' },
      { $set: { password: hashedPassword, phone: '0700000001' } },
      { upsert: true }
    );
    console.log('Password reset to Password@2026 successfully');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
resetPassword();
