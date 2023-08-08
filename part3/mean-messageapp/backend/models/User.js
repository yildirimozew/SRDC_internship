const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

let User = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
   name: {
      type: String
   },
   surname: {
      type: String
   },
   gender: {
      type: String
   },
   isAdmin: {
      type: Boolean
   },
   Birthday : {
      type: Date
    }
}, {
   collection: 'Users'
})

User.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    
    const hashedPassword = await bcrypt.hash(this.password, salt);
    
    this.password = hashedPassword;
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', User)