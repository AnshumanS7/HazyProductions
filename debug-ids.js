require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    await mongoose.connect(MONGODB_URI);
    const products = await mongoose.connection.db.collection('products').find({}).project({ _id: 1, title: 1 }).toArray();
    console.log("Current Products in DB:");
    products.forEach(p => console.log(`ID: ${p._id.toString()} | Title: ${p.title}`));
    process.exit(0);
}

check();
