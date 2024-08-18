// src/utils/generateStoreId.ts
export const generateStoreId = (storeName: string): string => {
  // Clean the store name to remove spaces and special characters
  const cleanStoreName = storeName.replace(/\s+/g, '').toLowerCase();

  // Generate a random number and a timestamp
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
  const timestamp = Date.now().toString(); // current timestamp
  // Combine cleaned store name, random number, and timestamp to form the store ID
  const storeId = `${cleanStoreName}-${randomNum}-${timestamp}`;

  return storeId;
};
