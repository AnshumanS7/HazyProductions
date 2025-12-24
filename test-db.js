require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log("URI Length:", uri ? uri.length : 0);

if (!uri) {
    console.log("URI is missing");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log("Connected successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.log("CONNECTION ERROR:", err.name);
        console.log("ERROR MESSAGE:", err.message);
        if (err.cause) console.log("CAUSE:", err.cause);
        process.exit(1);
    });
