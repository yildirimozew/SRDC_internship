const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Log = new Schema({
  username: {
    type: String
  },
  action: {  
    type: String
  },
   date: {
      type: Date
   }
}, {
   collection: 'Logs'
})
module.exports = mongoose.model('Log', Log)