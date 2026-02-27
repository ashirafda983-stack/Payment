export default async function handler(req, res) {
    // Only allow POST requests (security measure)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount, phone, orderId } = req.body;

    // Validate inputs
    if (!amount || !phone || !orderId) {
        return res.status(400).json({ error: 'Missing payment details (amount, phone, or orderId)' });
    }

    try {
        const response = await fetch("https://wire.makylegacy.com/api/v1/payments/request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                // This is your unique Authorization Header from your text file
                "Authorization": "Basic bWFreV92MV9wdWJfZ01pUFFUdnVvQmhsUVJNRmVybEU6bWFreV92MV9zZWNfbDFHbFF5Q3B0MmdoNkVZZ2xQam5WTmdZMjFpSDdIRHU="
            },
            body: JSON.stringify({
                amount: amount,
                currency: "UGX",
                phone: phone,
                merchant_reference: orderId,
                // Replace with your actual website domain later
                callback_url: "https://your-firebase-project.web.app/payment-success" 
            })
        });

        const data = await response.json();

        // Send the MakyPay response back to your website
        res.status(200).json(data);

    } catch (error) {
        console.error("MakyPay Error:", error);
        res.status(500).json({ error: "Failed to connect to payment provider" });
    }
}
