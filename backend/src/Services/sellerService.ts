import { Seller } from '../Models/models';

export const updateSellerProfile = async (
  sellerId: string,
  fullName: string,
  businessName: string,
  phoneNumber: string
): Promise<void> => {
  const seller = await Seller.findById(sellerId);

  if (!seller) {
    throw new Error("Seller not found");
  }

  seller.fullName = fullName;
  seller.businessName = businessName;
  seller.phoneNumber = phoneNumber;
  await seller.save();
};

// ... rest of the file (if any) ...

