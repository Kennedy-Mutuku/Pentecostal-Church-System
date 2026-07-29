require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const SuperAdmin = require('./models/superAdmin');
const AdmissionAdmin = require('./models/admissionAdmin');
const Overseer = require('./models/overseer');
const Patron = require('./models/patron');
const BibleStudyAdmin = require('./models/bsAdmin');
const MissionAdmin = require('./models/missionAdmin');
const AdminNews = require('./models/adminNews');

async function seed() {
  try {
    const uri = process.env.DB_CONNECTION_URI;
    if (!uri) throw new Error("DB_CONNECTION_URI is not defined in .env");
    
    await mongoose.connect(uri);
    
    const password = 'Password@2026';
    const hashedPassword = await bcrypt.hash(password, 10);
    const phone = '0700000000';

    const usersToCreate = [
      { model: SuperAdmin, data: { email: 'admin@rpcmcsuperadmin.co.ke', password: hashedPassword, phone: '0700000001' } },
      { model: AdmissionAdmin, data: { email: 'admin@rpcmcadmissionadmin.co.ke', password: hashedPassword, phone: '0700000002' } },
      { model: Overseer, data: { email: 'overseer@rpc-nyamira.co.ke', password: hashedPassword } },
      { model: Patron, data: { email: 'patron@rpc-nyamira.co.ke', password: hashedPassword } },
      { model: BibleStudyAdmin, data: { email: 'admin@rpcmcbsadmin.co.ke', password: hashedPassword, phone: '0700000003' } },
      { model: MissionAdmin, data: { email: 'admin@rpcmcmissionadmin.co.ke', password: hashedPassword, phone: '0700000004' } },
      { model: AdminNews, data: { email: 'admin@rpcmcnewsadmin.co.ke', password: hashedPassword, phone: '0700000005' } }
    ];

    for (const { model, data } of usersToCreate) {
      let user = await model.findOne({ email: data.email });
      if (!user) {
        await model.create(data);
      } else {
        await model.updateOne({ email: data.email }, { $set: data });
      }
    }
    console.log('Seeded frontend-compatible emails successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.disconnect();
  }
}
seed();
