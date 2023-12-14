import mongoose,{Schema} from "mongoose";
const UserSchema = new Schema(
    {
     username:{
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim: true,
        index: true
     },
     email:{
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim: true
     },
     fullName:{
        type: String,
        required : true,
        trim: true,
        index: true
     },
     avatar:{
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim: true,
        index: true
     },
     coverImage:{
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim: true,
        index: true
     },
     password:{
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim: true,
        index: true
     },
     refreshToken:{
        type: String,
        required : true,
        unique: true,
        lowercase : true,
        trim: true,
        index: true
     },
},{timetamps: true}

)

export const User = mongoose.model("User",UserSchema)