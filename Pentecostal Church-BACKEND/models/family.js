const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  familyName: { type: String, required: true, trim: true },
  headOfFamily: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  residence: { type: String, default: null },
  originFamily: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Family', familySchema);
