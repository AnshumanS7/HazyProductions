import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Product from '../models/Product';
import dbConnect from '../lib/mongodb';

dotenv.config();

const PRODUCT_ID = "693575a0153771eba17413d1";

async function deleteProduct() {
    try {
        await dbConnect();

        const result = await Product.findByIdAndDelete(PRODUCT_ID);

        if (result) {
            console.log(`Successfully deleted product: ${result.title} (${PRODUCT_ID})`);
        } else {
            console.log(`Product not found: ${PRODUCT_ID}`);
        }

    } catch (error) {
        console.error("Error deleting product:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

deleteProduct();
