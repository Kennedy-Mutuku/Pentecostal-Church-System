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
  hasVoted: { type: Boolean, default: false },
  votedAt: { type: Date },
  votedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'PollingOfficer' },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'PollingOfficer' },
  financeRole: {
    type: String,
    enum: ['treasurer', 'auditor', 'chair_accounts', 'chairperson', null],
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
