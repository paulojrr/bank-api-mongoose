const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    min: 0,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
