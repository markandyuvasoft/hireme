import Stripe from "stripe";
import Deposit from "../../models/Deposit-M/depositSchema.js";

var p = "pk_test_51R24TDCLdUumWpxRSqfNzMeelPy8cj7ujiXnqNIXKfZBQrdByrs8kn6Gs9iW1ZEkRchosbmtc7PY9HrkjMrWKPWu00yahQ3gxl";
var s = "sk_test_51R24TDCLdUumWpxRyLv8HRxZtUMh3Ey5zVHQCS4ZO4xrEpfNONe4BI1QR1a9afbw86A54MWCPNYmqBIBBRw9VY4c00Pb5NJH8J";


const stripe = new Stripe(s);


const INR_TO_USD = 87.04;

export const addDeposit = async (req, res) => {

    try {
        const { authId } = req.params;

        const { depositAmountUSD, status } = req.body;


        const processChargeUSD = (depositAmountUSD * 1) / 100;
        const totalAmountUSD = depositAmountUSD + processChargeUSD;

        if (isNaN(totalAmountUSD)) {
            return res.status(400).json({ message: "Invalid total amount in USD" });
        }

        const totalAmountINR = parseFloat((totalAmountUSD * INR_TO_USD).toFixed(2));

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ["card"],

            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "MetaLance Wallet Deposit",
                        description: `IN: ₹${totalAmountINR.toLocaleString()} | US: $${totalAmountUSD}\n(1 USD = ₹${INR_TO_USD})`
                    },
                    unit_amount: Math.round(totalAmountUSD * 100),
                },
                quantity: 1,
            }],
            mode: "payment",
            success_url: `https://yourwebsite.com/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://yourwebsite.com/cancel`,

            metadata: {
                authId,
                status,
                depositAmountUSD: depositAmountUSD.toString(),
                processChargeUSD: processChargeUSD.toString(),
                totalAmountUSD: totalAmountUSD.toString(),
                exchangeRate: `1 USD = ₹${INR_TO_USD}`
            },
        });

        const newDeposit = new Deposit({
            authId,
            depositAmountUSD: depositAmountUSD,
            process_charge: processChargeUSD,
            USDTotalAmount: totalAmountUSD,
            IndianTotalAmout: totalAmountINR,
            status: "pending",
            stripeSessionId: session.id,
        });

        await newDeposit.save();

        res.json({ success: true, url: session.url });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



export const manageStatus = async (req, res) => {

    try {
        const { session_id } = req.params;

        if (!session_id) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        let newStatus = "pending";

        if (session.payment_status === "paid") {
            newStatus = "success";

        } else if (session.payment_status === "canceled") {
            newStatus = "canceled";

        } else if (session.payment_status === "failed") {
            newStatus = "failed";

        } else {
            newStatus = "canceled";
        }

        const updatedDeposit = await Deposit.findOneAndUpdate(
            { stripeSessionId: session_id },
            { status: newStatus },
            { new: true }
        );

        if (!updatedDeposit) {
            return res.status(404).json({ message: "Deposit not found" });
        }

        res.json({ success: true, message: `Deposit status updated to ${newStatus}`, updatedDeposit });

    } catch (error) {

        await Deposit.findOneAndUpdate(
            { stripeSessionId: req.query.session_id },
            { status: "canceled" },
            { new: true }
        );

        res.status(500).json({ message: "Error occurred, status set to canceled" });
    }
}