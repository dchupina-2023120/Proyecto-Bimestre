import { Schema, model } from "mongoose";

const userSchema=Schema(
{
        name:{
            type:String,
            required:[true, 'Name is required'],
            maxLength:[25, `Can't be overcome 25 characters`]
        },
        surname:{
            type:String,
            required:[true, 'Surname is required'],
            maxLength:[25,`Can't be overcome 25 characters`]
        },
        username:{
            type:String,
            required:[true,'Username is required'],
            unique:true,
            lowercase:true,
            maxLength:[15,`Can't be overcome 15 characters`]
        },
        email:{
            type:String,
            unique:true,
            required:[true,,'Email is required']
        },
        password:{
            type:String,
            required:[true,'Password is required'],
            minLength:[8, 'Password must be 8 characteres'],
            maxLength:[100,`Can't be overcome 16 characteres`]
        },
        role:{
            type:String,
            default:'CLIENT',
            enum:['ADMIN','CLIENT'],
            uppercase:true,
        }
    },
    { timestamps: true, versionKey: false }
)

userSchema.methods.toJson = function(){
    const{__v,password,...user}=this.toObject()
    return user
}

export default model('User',userSchema)