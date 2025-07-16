const mongoose=require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: String, // Firebase UID is a string
        required: true
      },
    title:{
        type:String,
        required:true
        },

    description:{
        type:String,
        required:true,
        
    },
    tag:{
        type:String,
        default:"General"    

    },
    date:{
        type:Date,
        default:Date.now
    }


    
   
  });

  module.exports=mongoose.model('notes', NotesSchema);