const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/myappdatabase');

const userSchema = new Schema({
    name: {
      type: String,
      required: true,
      min: 1,
      max: [8,'不能超过8位']
    },
    password: {
      type: String,
      min:[8,'长度不能低于8'],
      max:[12,'长度超过12'],
      required: true
    },
    type:{
        type:String,
        required:true
      },
    messages: [
      {
         type: Schema.Types.ObjectId,
         ref: 'messages'
      }
    ] // add this property
  }, {collection: 'users'});
  
  const user = mongoose.model('users', userSchema);
  
  module.exports = {user}