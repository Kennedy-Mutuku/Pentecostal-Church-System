const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  ageGroup: { type: String, enum: ['Kid (12 and below)', 'Youth (13-35)', 'Adult (36-59)', 'Elderly (60 and above)'] },
  yearJoined: { type: String },
  residence: { type: String },
  password: { type: String },
  profilePhoto: { type: String, default: null }, // URL path to profile photo
  role: { type: String, enum: ['student', 'associate'], default: 'student' },
  graduationYear: { type: Number, default: null },
  financeRole: {
    type: String,
    enum: ['treasurer', 'auditor', 'chair_accounts', 'chairperson', null],
    default: null
  },
  webAuthnCredentials: [{
    credentialID: String,
    credentialPublicKey: Buffer,
    counter: Number,
    transports: [String]
  }],
  currentChallenge: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
