import mongoose from 'mongoose';

const User = new mongoose.Schema({
    name: {type: String, required: [true, "Name is required!"]},
    email: {type: String, required: [true, "Email is required!"], unique: true},
    passwordData: {
        password: {type: String, required: [true, "Password is required!"]},
        salt: {type: String, required: true}
    },

},{ strictPopulate: false });

const user = mongoose.model('users', User);

export default user;
