import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    // unique idneitfier of user
    auth0Id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
        sparse: true
    },
    name: String,
    lastLogin: Date
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);