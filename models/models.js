const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const userSchema = mongoose.Schema({
  accountNumber: Number,
  pinNumber: String,
  balance: Number,
  history:[{
    type: mongoose.Schema.ObjectId,
    ref: 'Transaction'
  }]
});

//type: Withdraw/Transaction/Deposit
const historySchema = mongoose.Schema({
  type: String,
  amount: Number,
  account: Number,
});

const User = mongoose.model('User', userSchema);
const History = mongoose.model('History', historySchema);

module.exports = {
    User,
    History
};
