const mongoose=require("mongoose");
const taskSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    completed:{type:Boolean,default:false},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    createdAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model("tasks",taskSchema);