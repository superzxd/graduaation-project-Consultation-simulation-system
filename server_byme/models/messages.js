const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/myappdatabase');

const messageSchema = new Schema({
    author:{
      type: Schema.Types.ObjectId,
      ref: 'users'
   },
    content:{
      type:[{
        sender:{
          type:String,
          required:true
        },
        message:{
          type:String,
          required:true
        }
      }],
      required:true
    },
    // zhusu:{
    //   type:String,
    //   required:true,
    // },
    starttime:{
      type:String,
      required:true,
    },
    endtime:{
      type:String,
      required:true,
    }
  },{collection:'messages'});

  const message = mongoose.model('messages', messageSchema);
  
  module.exports = {message};