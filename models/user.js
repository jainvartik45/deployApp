import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String },
  following : {type : [String]},
  followers : {type : [String]},
  message:[{
    
      id:{type:String},
      chat:[{type:String}]
    
    
}]
});

export default mongoose.model("User", userSchema);