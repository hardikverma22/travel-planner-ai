import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
// import { CartItem } from "@/types/type";
import stripe from "@/config/stripe";


export async function POST(req: NextRequest, res: NextResponse) {
    const headersList = headers();

    const product = {
        price_data: {
            currency: 'INR',
            product_data: {
                name: "Credits",
            },
            unit_amount: 1600,
        },
        quantity: 5,
    }

    try {
        const session = await stripe.checkout.sessions.create({
            // payment_method_types: ["card", ""],
            line_items: [product],
            mode: "payment",
            success_url: `${headersList.get("origin")}/dashboard`,
            cancel_url: `${headersList.get("origin")}/`,
            customer_email: "hardikvermadev@gmail.com"
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: "Error creating checkout session" });
    }
}