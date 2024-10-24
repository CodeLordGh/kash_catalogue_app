import axios from 'axios';
import { getAccessToken, createApiUser, createApiKey } from './payment';
import dotenv from "dotenv"

dotenv.config()

const MTN_API_URL = "https://sandbox.momodeveloper.mtn.com";

export const validateAccountHolderStatus = async (phoneNumber: string): Promise<boolean> => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `${MTN_API_URL}/collection/v1_0/accountholder/msisdn/${phoneNumber}/active`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': 'sandbox',
          'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
        },
      }
    );

    return response.data.result;
  } catch (error: any) {
    console.error('Error validating account holder status:', error.response?.data || error.message);
    // Instead of throwing an error, return false if the account is not found or there's an error
    return false;
  }
};

export const getBasicUserInfo = async (phoneNumber: string): Promise<any> => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `${MTN_API_URL}/collection/v1_0/accountholder/MSISDN/${phoneNumber}/basicuserinfo`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': 'sandbox',
          'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting basic user info:', error);
    throw error;
  }
};
