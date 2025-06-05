import mongoose from 'mongoose';

const ReflectionSchema = new mongoose.Schema({
    text:{
        type: String,
        required: [true, 'Reflection text is required']
    },
    emotions:{
        happy: { type: Number, default: 0 },
        sad: { type: Number, default: 0 },
        anxious: { type: Number, default: 0 },
        hopeful: { type: Number, default: 0 },
        tired: { type: Number, default: 0 },
        angry: { type: Number, default: 0 },
        calm: { type: Number, default: 0 }
    },
    dominantEmotion: String,
    userId:{
        // reference that it will store an id from user collection (user that is logged in)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    }
}, { timestamps: true });

export default mongoose.models.Reflection || mongoose.model('Reflection', ReflectionSchema);