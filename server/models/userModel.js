import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    clerkId:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    photo:{
        type:String,
        required:true
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    CreditBalance:{
        type:Number,
        default:20 
    }
});

const userModel=mongoose.model.user || mongoose.model("user",userSchema);
export default userModel;