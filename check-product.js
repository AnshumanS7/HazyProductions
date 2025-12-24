require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const MONGODB_URI = process.env.MONGODB_URI;
const searchTerm = process.argv[2];

if (!searchTerm) {
    console.error("Please provide a search term (title). Usage: node check-product.js \"Boom\"");
    process.exit(1);
}

async function check() {
    if (!MONGODB_URI) {
        console.error("MONGODB_URI missing from .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);

        // regex search for case insensitive title match
        const products = await Product.find({ title: { $regex: searchTerm, $options: 'i' } });

        if (products.length === 0) {
            console.log(`No products found matching "${searchTerm}"`);
        } else {
            console.log(`Found ${products.length} product(s):`);
            products.forEach(p => {
                console.log("---------------------------------------------------");
                console.log(`ID: ${p._id}`);
                console.log(`Title: ${p.title}`);
                console.log(`Price: ${p.price}`);
                console.log(`Category: ${p.category}`);
                console.log(`File Key: ${p.fileKey || "[NO FILE KEY]"}`);
                console.log(`Updated At: ${p.updatedAt}`);
                console.log("---------------------------------------------------");
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

check();
