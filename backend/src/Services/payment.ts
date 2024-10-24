import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv"
import fs from 'fs/promises';
import path from 'path';

dotenv.config()

const MTN_API_URL = "https://sandbox.momodeveloper.mtn.com";
const MTN_SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY;

const CREDENTIALS_FILE = path.join(__dirname, '..', '..', 'mtn_credentials.json');

async function loadOrCreateCredentials() {
  try {
    const data = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Creating new MTN credentials...');
    const userId = await createApiUser();
    const apiKey = await createApiKey(userId);
    const credentials = { userId, apiKey };
    await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials));
    return credentials;
  }
}

// Function to create API user
export const createApiUser = async () => {
  const referenceId = uuidv4();

  console.log(referenceId)
  console.log(MTN_SUBSCRIPTION_KEY)

  try {
    await axios.post(
      `${MTN_API_URL}/v1_0/apiuser`,
      { providerCallbackHost: "https://webhook.site/caa1dc58-9263-474a-8ae4-7be248e19fc8" },
      {
        headers: {
          'X-Reference-Id': referenceId,
          'Ocp-Apim-Subscription-Key': MTN_SUBSCRIPTION_KEY,
        },
      }
    );
    return referenceId;
  } catch (error) {
    console.error('Error creating API user:', error);
    throw error;
  }
};

// Function to create API key
export const createApiKey = async (userId: string) => {
  try {
    const response = await axios.post(
      `${MTN_API_URL}/v1_0/apiuser/${userId}/apikey`,
      {},
      {
        headers: {
          'Ocp-Apim-Subscription-Key': MTN_SUBSCRIPTION_KEY,
        },
      }
    );
    return response.data.apiKey;
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

// Function to get access token
export const getAccessToken = async () => {
  const { userId, apiKey } = await loadOrCreateCredentials();
  try {
    const response = await axios.post(
      `${MTN_API_URL}/collection/token/`,
      {},
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${userId}:${apiKey}`).toString('base64')}`,
          'Ocp-Apim-Subscription-Key': MTN_SUBSCRIPTION_KEY,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

export const initiateMtnPayment = async ({
  phoneNumber,
  amount,
  orderId,
}: {
  phoneNumber: string;
  amount: number;
  orderId: string;
}) => {
  try {
    const accessToken = await getAccessToken();
    const referenceId = uuidv4();

    const response = await axios.post(
      `${MTN_API_URL}/collection/v2_0/requesttowithdraw`,
      {
        amount: amount.toString(),
        currency: 'EUR',
        externalId: orderId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber,
        },
        payerMessage: 'Payment for your order',
        payeeNote: `Order ${orderId}`,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': 'sandbox',
          'Ocp-Apim-Subscription-Key': MTN_SUBSCRIPTION_KEY,
        },
      }
    );

    return {
      success: true,
      paymentRequestId: referenceId,
    };
  } catch (error) {
    // console.error('MTN payment initiation error:', error);
    return {
      success: false,
      error: 'Failed to initiate payment',
    };
  }
};

export const checkMtnPaymentStatus = async (paymentRequestId: string) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `${MTN_API_URL}/collection/v1_0/requesttopay/${paymentRequestId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': 'sandbox',
          'Ocp-Apim-Subscription-Key': MTN_SUBSCRIPTION_KEY,
        },
      }
    );

    const paymentDetails = response.data;
    
    if (paymentDetails.status === 'SUCCESSFUL') {
      return {
        success: true,
        status: 'completed',
        transactionId: paymentDetails.financialTransactionId,
        paymentDetails: paymentDetails,
      };
    } else if (paymentDetails.status === 'PENDING') {
      return { success: true, status: 'pending' };
    } else {
      return { success: false, status: 'failed', error: 'Payment failed' };
    }
  } catch (error: any) {
    console.error('Error checking MTN payment status:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      return { success: false, status: 'not_found', error: 'Payment not found' };
    }
    return { success: false, status: 'api_error', error: 'Error checking payment status' };
  }
};
