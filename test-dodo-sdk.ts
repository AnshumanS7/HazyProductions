import 'dotenv/config';
import DodoPayments from 'dodopayments';

const dodo = new DodoPayments({
    bearerAuth: process.env.DODO_PAYMENTS_API_KEY,
    environment: 'test_mode',
});

async function testCheckout() {
    console.log("Testing Dodo Checkout SDK...");
    console.log("API Key present:", !!process.env.DODO_PAYMENTS_API_KEY);

    try {
        const payload: any = {
            // Minimal required fields first
            billing: {
                city: "New York", country: "US", state: "NY", street: "123 Street", zipcode: "10001"
            },
            customer: {
                email: "test@example.com",
                name: "Test User"
            },
            product_cart: [{
                product_id: "test_product_id",
                quantity: 1,
                amount: 1000 // 10.00
            }],
            amount: 1000,
            currency: "USD",
            return_url: "http://localhost:3000/dashboard"
        };

        console.log("Sending Payload:", JSON.stringify(payload, null, 2));

        const session = await dodo.checkoutSessions.create(payload);

        console.log("SUCCESS!");
        console.log("Response Keys:", Object.keys(session));
        console.log("Full Response:", JSON.stringify(session, null, 2));

    } catch (error: any) {
        console.error("FAILED!");
        console.error("Error Message:", error.message);
        console.error("Error Object:", JSON.stringify(error, null, 2));
    }
}

testCheckout();
