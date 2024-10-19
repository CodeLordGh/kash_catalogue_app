import express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Seller, Catalog, Product } from '../Models/models';
import { authenticateToken } from '../Utils/auth';
import { updateSellerProfile } from '../Services/sellerService';

export interface CustomRequest extends Request {
  user?: {
    id: string;
    catalog: any;
    sender: string;
    senderModel: string;
    receiver: string;
    receiverModel: string;
  };
  token?: string
}

const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/// <reference types="../../types" />

router.post('/seller/register', async (req: CustomRequest, res: Response) => {
  try {
    const { fullName, businessName, email, password } = req.body;

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // generate a storeId
    const storeId = businessName + "-" + generateStoreId () 

    // Create new seller
    const newSeller = new Seller({
      fullName,
      businessName,
      email,
      password: hashedPassword,
      storeId
    });

    // Create a catalog for the seller
    const catalog = new Catalog({ seller: newSeller._id });
    await catalog.save();

    newSeller.catalog = catalog._id;
    await newSeller.save();

    res.status(201).json({ message: 'Seller registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering seller', error });
  }
});

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

// Login route
router.post('/seller/login', async (req: CustomRequest, res) => {

  let products
  try {
    const { email, password, fcmToken } = req.body;
    const seller = await Seller.findOne({ email }).select('-refreshToken -createdAt -__v');
    if (seller) products = await Catalog.find({catalog: seller.catalog})

    if (!seller || !await bcrypt.compare(password, seller.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(seller._id) ;
    const refreshToken = jwt.sign({ id: seller._id }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    seller.refreshToken = refreshToken;
    if(fcmToken) seller.fcmToken = fcmToken
    await seller.save();

    seller.password = "" //undefined as any

    res.status(200).json({ accessToken, user: seller, products });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
})

router.route("/seller/product").post(authenticateToken, async (req: CustomRequest, res) => {
  const { name, price, description, stock } = req.body;
  const user = req.user
  const catalog = user?.catalog

  try {
    const newProduct = new Product({
      name, price, description, stock, catalog
    });
    await newProduct.save();
    return res.status(201).json({ message: "Product added successfully"});
  } catch (error) {
    return res.status(500).json({message: "Server internal Error!"})
  }
}).get(authenticateToken, async (req: CustomRequest, res) => {
  const catalog = req.user?.catalog

  try {
    await Catalog.find({_id: catalog}).populate("products").then(()=> {
      return res.status(200).json({products: catalog?.products})
    })
  } catch (error) {
    return res.status(500).json({message: "Internal server Error!"})
  }
  // Product.find({ _id: { $in: catalog.products } });

})

// Refresh token route
router.post('/token/refresh', async (req: CustomRequest, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: string };
    const seller = await Seller.findById(decoded.id);

    if (!seller || seller.refreshToken !== refreshToken) {
      return res.sendStatus(403);
    }

    const accessToken = generateAccessToken(seller._id);
    res.json({ accessToken });
  } catch (error) {
    res.sendStatus(403);
  }
});

// Logout route
router.post('/seller/logout', authenticateToken, async (req: CustomRequest, res) => {
  try {
    const seller = await Seller.findById(req.user?.id);
    if (seller) {
      seller.refreshToken = undefined;
      seller.tokenBlacklist.push(req.token? req.token : ""); // Add the current token to the blacklist
      await seller.save();
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error });
  }
});

export function generateAccessToken(id: any) : string {
  return jwt.sign({ id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

function generateStoreId() {
  return  Math.floor(100000 + Math.random() * 900000);

}

// Update seller profile
router.put('/seller/profile', authenticateToken, async (req: CustomRequest, res) => {
  try {
    const { fullName, businessName, phoneNumber } = req.body;
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    await updateSellerProfile(sellerId, fullName, businessName, phoneNumber);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
