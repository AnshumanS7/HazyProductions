require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const MONGODB_URI = process.env.MONGODB_URI;

const email = process.argv[2];

if (!email) {
    console.error("Please provide an email address. Usage: node promote-admin.js <email>");
    process.exit(1);
}

async function promote() {
    if (!MONGODB_URI) {
        console.error("MONGODB_URI missing from .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);

        const user = await User.findOne({ email: email });
        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await User.updateOne({ _id: user._id }, { $set: { role: 'admin' } }); // Force update

        console.log(`Success! User ${email} is now an Admin.`);
        console.log("Please sign out and sign back in for changes to take effect.");
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

promote();
