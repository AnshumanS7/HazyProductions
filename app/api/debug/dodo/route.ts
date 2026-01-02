import { NextResponse } from "next/server";
import { dodo } from "@/lib/dodo";

export async function GET() {
    const report: any = {
        clientKeys: Object.keys(dodo),
        // Inspect generic properties to find resources
        resources: {}
    };

    const candidates = ['payments', 'checkout', 'checkoutSessions', 'subscriptions', 'customers'];

    candidates.forEach(res => {
        const resource = (dodo as any)[res];
        if (resource) {
            report.resources[res] = {
                type: typeof resource,
                keys: Object.keys(resource),
                proto: Object.getPrototypeOf(resource) ? Object.getOwnPropertyNames(Object.getPrototypeOf(resource)) : 'null'
            };
        } else {
            report.resources[res] = 'MISSING';
        }
    });

    return NextResponse.json(report);
}
