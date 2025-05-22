import mongoose, {Schema} from "mongoose"; 

const userprofileSchema = new Schema({
    contactNumber: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null,
    },
    gender: {
        type: String,
        default: null,
        enum: ['Female', 'Male', 'Other']
    },
    dateOfBirth: {
        type: Date,
        default: null,
    }
})

const UserProfile = mongoose.nodel('UserProfile', userprofileSchema)
export default UserProfile