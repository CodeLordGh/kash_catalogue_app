import { generateUniqueId } from "../Utils/buyerId";
import { Buyer, Seller, Catalog, Product, Order } from "../Models/models";
import * as admin from "firebase-admin";
import crypto from "crypto";
import mongoose from "mongoose";
import { generateAccessToken } from "../Routes/seller";
import { Chat } from "../Models/chatModel";

{/** TODO: use crypto to generate chatId */}

const updatePhoneNumber = async (buyerId: string, phoneNumber: string) => {
  const result = await Buyer.updateOne(
    { buyerId: buyerId, phoneNumber: null },
    { $set: { phoneNumber: phoneNumber } }
  );
  
  if (result.modifiedCount === 0) {
    throw new Error('Phone number already exists or buyer not found');
  }
};

export const registerBuyer = async (
  storeId: string
): Promise<{ user: IBuyer & { seller: ISeller, catalog: any, type: string }, accessToken: string }> => {
  let chatId: string | undefined;

  try {
    const seller = await Seller.findOne({ storeId }).select('-password -email -chatId -phoneNumber -refreshToken -tokenBlacklist -fullName -customers -createdAt -updatedAt -__v');
    if (!seller) {
      throw new Error("No store found!");
    }

    const buyerId = generateUniqueId().toString();
    const buyer = new Buyer({ buyerId, associatedStores: [seller._id] });

    chatId = generateUniqueId().toString();
    const chatData = {
      storeId,
      buyerId,
      messages: [
        {
          sender: seller.storeId,
          message: `Welcome to ${seller.businessName}!`,
          timestamp: admin.database.ServerValue.TIMESTAMP,
          _id: "imone"
        },
      ],
    };

    await admin.database().ref(`chats/${chatId}`).set(chatData);
    buyer.chatId = chatId;
    seller.chatId = chatId;

    await buyer.save();
    await seller.save();

    const catalog = await Catalog.findById(seller.catalog).select('-_id -createdAt -updatedAt -__v -seller').populate({
      path: 'products',
      select: '-__v'
    });

    const accessToken = generateAccessToken(buyer._id);

    return {
      user: {
        ...buyer.toObject(),
        seller: {
          businessName: seller.businessName,
          storeId: seller.storeId,
          catalog: seller.catalog,
        },
        type: 'User',
        catalog
      },
      accessToken
    };
  } catch (error) {
    // Delete the chat from Firebase if it was created
    if (chatId) {
      await admin.database().ref(`chats/${chatId}`).remove();
    }

    console.error("Error creating chat or user:", error);
    throw new Error("Error creating chat or user");
  }
};

interface IBuyer {
  fullName?: string;
  buyerId: string;
  serviceProvider?: string;
  cart: Array<{
    product: mongoose.Types.ObjectId;
    quantity: {
      color?: string;
      qty: number;
    };
  }>;
  orders: mongoose.Types.ObjectId[];
  associatedStores: mongoose.Types.ObjectId[];
  chatId?: string;
}

interface ISeller {
  fullName?: string; // Make optional
  businessName: string;
  storeId: string;
  catalog: mongoose.Types.ObjectId;
  customers?: mongoose.Types.ObjectId[];
  deliveryAddresses?: mongoose.Types.ObjectId[];
  chatId?: string[];
  password?: string; // Make optional
  email?: string; // Make optional
}


export const loginBuyer = async (input: string, fcmToken: string) => {
  console.log("frontend data input is ",input)
  try {
    const user = await Buyer.findOne({ buyerId: input }).populate({
      path: 'cart.product',
      select: '-__v'
    }).populate({
      path: 'orders',
      select: '-__v',
      populate: {
        path: 'items.product',
        select: '-__v'
      }
    }).populate({
      path: 'associatedStores',
      select: 'businessName storeId catalog'
    });
    
    if (!user) {
      console.log("no user found")
      return null
    }
    
    // Assuming associatedStores is an array of ObjectId, we need to access the first one
    const associatedStore = user.associatedStores[0] as unknown as ISeller; // Type assertion
    
    const seller = await Seller.findById(associatedStore).select('-password -email -chatId -_id -phoneNumber -refreshToken -tokenBlacklist -fullName -customers -createdAt -updatedAt -__v');
    
    const catalog = await Catalog.findById(seller?.catalog).select('-_id -createdAt -updatedAt -__v -seller').populate({
      path: 'products',
      select: '-__v'
    });
  
    if (fcmToken) {
      user.fcmToken = fcmToken;
      await user.save();
    }

    return {
      ...user.toObject(),
      seller,
      type: 'User',
      catalog
    };
  } catch (error) {
    throw error
  }
};

export const updateBuyerProfile = async (
  buyerId: string,
  profileData: { fullName: string; phoneNumber: string; serviceProvider: string }
): Promise<void> => {
  const buyer = await Buyer.findById(buyerId);

  if (!buyer) {
    throw new Error("Buyer not found");
  }

  buyer.fullName = profileData.fullName;
  buyer.phoneNumber = profileData.phoneNumber;
  buyer.serviceProvider = profileData.serviceProvider;
  await buyer.save();
};

export const viewCatalog = async (
  buyerId: string,
  storeId: string
): Promise<(typeof Product)[]> => {
  const buyer = await Buyer.findOne({ buyerId });
  if (!buyer) {
    throw new Error("Buyer not found");
  }

  const seller = await Seller.findOne({ storeId });
  if (!seller) {
    throw new Error("Store not found");
  }

  if (!buyer.associatedStores.includes(seller._id)) {
    throw new Error("Buyer is not associated with this store");
  }

  const catalog = await Catalog.findOne({ seller: seller._id });
  if (!catalog) {
    throw new Error("Catalog not found");
  }

  return Product.find({ _id: { $in: catalog.products } });
};

export const addToCart = async (
  buyerId: string,
  productId: string,
  quantity: number
): Promise<void> => {
  const buyer = await Buyer.findOne({ buyerId });
  if (!buyer) {
    throw new Error("Buyer not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const cartItem = buyer.cart.find(
    (item) => item.product.toString() === productId
  );
  if (cartItem) {
    cartItem.quantity.qty += quantity;
  } else {
    buyer.cart.push({
      product: product._id,
      quantity: { color: "string", qty: quantity },
    });
  }

  await buyer.save();
};

export const removeFromCart = async (
  buyerId: string,
  productId: string
): Promise<void> => {
  const buyer = await Buyer.findOne({ buyerId });
  if (!buyer) {
    throw new Error("Buyer not found");
  }

  buyer.cart = buyer.cart.filter(
    (item) => item.product.toString() !== productId
  );
  await buyer.save();
};

export const viewCart = async (buyerId: string): Promise<any[]> => {
  const buyer = await Buyer.findOne({ buyerId }).populate("cart.product");
  if (!buyer) {
    throw new Error("Buyer not found");
  }

  return buyer.cart.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
};

export const createOrder = async (
  buyerId: string,
  deliveryAddress: string
): Promise<{ orderId: string }> => {
  const buyer = await Buyer.findOne({ buyerId }).populate({
    path: "cart",
    populate: {
      path: "product",
      model: "Product",
      populate: { path: "catalog" },
    },
  });

  if (!buyer) {
    throw new Error("Buyer not found");
  }

  if (buyer.cart.length === 0) {
    throw new Error("Cart is empty");
  }

  if (!buyer.fullName || !buyer.phoneNumber) {
    throw new Error(
      "Please update your profile with full name and phone number before placing an order"
    );
  }

  const orderId = generateUniqueId().toString();
  const totalAmount = buyer.cart.reduce(
    (total, item: any) => total + item.product.price * item.quantity,
    0
  );

  const order = new Order({
    orderId,
    buyer: buyer._id,
    seller:
      buyer.cart[0].product instanceof Product
        ? buyer.cart[0].product.catalog
        : null, // Assuming all products in cart are from the same seller
    items: buyer.cart.map((item: any) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    })),
    totalAmount,
    deliveryAddress,
    status: "pending",
  });

  if (order.seller == null) {
    throw new Error("No seller found");
  }

  await order.save();

  // Clear the cart after creating the order
  buyer.cart = [];
  await buyer.save();

  return { orderId };
};

export const getOrderHistory = async (buyerId: string) => {
  const buyer = await Buyer.findOne({ buyerId });
  if (!buyer) {
    throw new Error("Buyer not found");
  }
  const orders = await Order.find({ buyer: buyer._id }).sort({ createdAt: -1 });
  return orders;
};

export const getOrderDetails = async (buyerId: string, orderId: string) => {
  const buyer = await Buyer.findOne({ buyerId });
  if (!buyer) {
    throw new Error("Buyer not found");
  }

  const order = await Order.findOne({ orderId, buyer: buyer._id }).populate(
    "items.product"
  );
  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};
