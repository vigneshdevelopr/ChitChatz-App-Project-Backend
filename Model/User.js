import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    firstName:{
        type: 'string',
        required: true,
        min: 5,
        max:15,
        unique: true
    },
    lastName:{
        type: 'string',
        required: true,
        min: 1,
        max:15,
        unique: true
    },
    email:{
        type: 'string',
        required: true,
        max:25,
        unique: true
    },
    password:{
        type: 'string',
        required: true,
        max:20,
    },
    
    avatarImage:{
        type: 'string',
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},
{timestamps: true}

)


const generateAuthToken = (id)=>{
    return jwt.sign({id}, process.env.SecretKey)
}

 const User = mongoose.model("User", userSchema );

 export {User, generateAuthToken}