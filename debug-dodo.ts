import DodoPayments from 'dodopayments';

console.log("Checking DodoPayments prototype...");
try {
    const client = new DodoPayments({ bearerAuth: 'test', environment: 'test_mode' });
    console.log("Client Keys:", Object.keys(client));

    ['payments', 'checkout', 'checkoutSessions', 'subscription'].forEach(res => {
        if ((client as any)[res]) {
            console.log(`client.${res} exists.`);
            console.log(`Keys on ${res}:`, Object.keys((client as any)[res]));
            // Also print prototype keys 
            console.log(`Proto on ${res}:`, Object.getOwnPropertyNames(Object.getPrototypeOf((client as any)[res])));
        } else {
            console.log(`client.${res} missing.`);
        }
    });
} catch (e) {
    console.error(e);
}
