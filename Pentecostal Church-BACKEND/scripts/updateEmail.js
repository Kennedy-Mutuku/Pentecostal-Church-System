const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ksucu-mc').then(async () => {
  await mongoose.connection.collection('admissionadmins').updateOne(
    { email: 'admin@ksucumcadmissionadmin.co.ke' },
    { $set: { email: 'admin@rpcmcadmissionadmin.co.ke' } }
  );
  console.log('Successfully updated admission admin email to admin@rpcmcadmissionadmin.co.ke');
  process.exit(0);
});
