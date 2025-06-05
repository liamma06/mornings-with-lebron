import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
}, { timestamps: true });

//pre to hash password before saving (note to self: acts like a middleware function)
//you call next() to tell mongoose your done with logic and it can continue with the save operation
UserSchema.pre('save', async function(next) {

    //this is used to store the object being saved (username, email, password) and such info
    // .isModified('password') checks if the password field has been modified ( no need to hash again if not modified)
    if (!this.isModified('password')) {
        return next();
    }

    try{
        const salt =await bcrypt.genSalt(10); 
        //the object sent's password is what is refered to as this 
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch (error) {
        next(error); 
    }
});

//What is .methods?
// .methods (function of mongoose) allows every object created from the schema to call this funciton
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try{
        return await bcrypt.compare(candidatePassword, this.password);
    }catch (error){
        throw error;
    }
}

//if model already exists, use it, otherwise create a new one
export default mongoose.models.User || mongoose.model('User', UserSchema);