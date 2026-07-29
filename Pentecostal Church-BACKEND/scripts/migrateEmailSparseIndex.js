const mongoose = require('mongoose');
require('dotenv').config();

// Rebuilds the `email` unique index on the users collection as sparse, so that
// multiple users with no email (family dependents) can coexist without a
// duplicate-key error. Mongoose does not auto-upgrade an already-deployed
// non-sparse unique index, so this must be run once before the new
// family-admission code (which allows admitting users without an email) goes live.
const migrate = async () => {
  try {
    const dbUri = process.env.DB_CONNECTION_URI || 'mongodb://127.0.0.1:27017/rpc-nyamira';
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const usersCollection = mongoose.connection.collection('users');

    const nullEmailCount = await usersCollection.countDocuments({ email: null });
    if (nullEmailCount > 0) {
      console.error(
        `Found ${nullEmailCount} user(s) with email explicitly set to null. ` +
        `These must be fixed (unset the field instead of null) before the sparse index can be created. Aborting.`
      );
      return;
    }

    const indexes = await usersCollection.indexes();
    const emailIndex = indexes.find((idx) => idx.key && idx.key.email === 1);

    if (emailIndex && emailIndex.sparse) {
      console.log('email index is already sparse. Nothing to do.');
      return;
    }

    if (emailIndex) {
      console.log(`Dropping existing non-sparse index "${emailIndex.name}"...`);
      await usersCollection.dropIndex(emailIndex.name);
    }

    console.log('Creating sparse unique index on email...');
    await usersCollection.createIndex({ email: 1 }, { unique: true, sparse: true });

    console.log('Migration complete: email index is now unique + sparse.');
  } catch (error) {
    console.error('Error migrating email index:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

migrate();
