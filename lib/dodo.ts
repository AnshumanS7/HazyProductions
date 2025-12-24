import DodoPayments from 'dodopayments';

export const dodo = new DodoPayments({
    bearerAuth: process.env.DODO_PAYMENTS_API_KEY, // Use API Key from environment variables
    environment: 'test_mode', // Default to test mode
});
