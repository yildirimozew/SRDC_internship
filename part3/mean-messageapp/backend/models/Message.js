const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Message = new Schema({
  title: {
    type: String
  },
  message: {  
    type: String
  },
   sender: {
      type: String
   },
   receiver: {
      type: String
   },
   deleted_sender: {
      type: Boolean
   },
   deleted_receiver: {
      type: Boolean
   },
   Date : {
      type: Date
    }
}, {
   collection: 'Messages'
})
module.exports = mongoose.model('Message', Message)