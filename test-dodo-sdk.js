require('dotenv').config();
const { default: DodoPayments } = require('dodopayments');

// Check if default export works, otherwise try named
const Dodo = DodoPayments || require('dodopayments').DodoPayments;

console.log("Initializing Dodo Client...");
const dodo = new Dodo({
    bearerAuth: process.env.DODO_PAYMENTS_API_KEY,
    environment: 'test_mode',
});

async function testCheckout() {
    console.log("Testing Dodo Checkout SDK (JS)...");

    try {
        console.log("Creating Test Product...");
        const product = await dodo.products.create({
            name: "Test Product " + Date.now(),
            description: "Temporary test product",
            amount: 1000, // 10.00
            currency: "USD",
            image: "https://example.com/image.png"
        });

        console.log("Product Created:", product.product_id);

        const payload = {
            billing: {
                city: "New York", country: "US", state: "NY", street: "123 Street", zipcode: "10001"
            },
            customer: {
                email: "test@example.com",
                name: "Test User"
            },
            product_cart: [{
                product_id: product.product_id,
                quantity: 1
            }],
            return_url: "http://localhost:3000/dashboard"
        };

        console.log("Sending Checkout Payload:", JSON.stringify(payload, null, 2));

        const session = await dodo.checkoutSessions.create(payload);

        console.log("SUCCESS!");
        console.log("Link:", session.payment_link);

    } catch (error) {
        console.error("FAILED!");
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("API Response Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

testCheckout();
