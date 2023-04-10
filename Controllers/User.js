import { User } from "../Model/User.js";
import bcrypt from 'bcrypt';

export const signup = async(req, res)=>{
try {
    const {firstName, lastName, email, password} = req.body;
const UserChk = await User.findOne({firstName})
if(UserChk){
 return res.json({message: "User already exists", status: false})
}
const MailChk = await User.findOne({email})
if(MailChk){
  return res.json({message: "Email already exists, Please enter a valid email", status: false})
}
//password hashing:
const hashPassword = await bcrypt.hash(password, 10)
const user = await User.create({
    firstName, 
    lastName, 
    email,
    password: hashPassword,
})
return res.json({user, status: true});
} catch (error) {
    return res.json({message: error.message, status: false});
}

}
//================================================================
export const Login = async(req, res)=>{
    try {
        const { email, password} = req.body;
    const users = await User.findOne({email})
    if(!users){
     return res.json({message: "Invalid Credentials", status: false})
    }
    const PassChk = await bcrypt.compare(password, users.password)
    if(!PassChk){
        return res.json({message: "Invalid Credentials", status: false})
    }
     
    return res.json({users, status: true});
    } catch (error) {
        return res.json({message: error.message, status: false});
    }
    
    }
    //================================================================

    export const Friends = async(req, res)=>{
        try {
            const allusers = await User.find({_id:{$ne: req.params.id}}).select([
                'firstName','email','avatarImage','_id'
            ])
            return res.status(200).json(allusers)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }