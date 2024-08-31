import axios from 'axios';

interface MpesaPaymentParams {
  phoneNumber: string;
  amount: number;
  orderId: string;
}

const baseUrl = ""

export const initiateMpesaPayment = async ({ phoneNumber, amount, orderId }: MpesaPaymentParams) => {
  try {
    // Generate access token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const tokenResponse = await axios.get(process.env.MPESA_OAUTHURL? process.env.MPESA_OAUTHURL : "", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Initiate STK Push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESSA_PASSKEY}${timestamp}`).toString('base64');

    const stkPushResponse = await axios.post(
        process.env.MPESA_STK_PUSH_URL? process.env.MPESA_STK_PUSH_URL : "",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${baseUrl}/api/mpesa/callback`,
        AccountReference: orderId,
        TransactionDesc: `Payment for order ${orderId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      success: true,
      checkoutRequestID: stkPushResponse.data.CheckoutRequestID,
    };
  } catch (error) {
    console.error('M-Pesa payment initiation error:', error);
    return {
      success: false,
      error: 'Failed to initiate M-Pesa payment',
    };
  }
};
