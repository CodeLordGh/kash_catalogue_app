import express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Seller, Catalog } from '../Models/models';
import { authenticateToken } from '../Utils/auth';

interface CustomRequest extends Request {
  user?: {
    id: string;
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
    const storeId = businessName + "-" + generateStoreId (businessName) 

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
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });

    if (!seller || !await bcrypt.compare(password, seller.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(seller._id) ;
    const refreshToken = jwt.sign({ id: seller._id }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    seller.refreshToken = refreshToken;
    await seller.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

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

function generateAccessToken(id: any) : string {
  return jwt.sign({ id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

function generateStoreId(name:string) {
  return  Math.floor(100000 + Math.random() * 900000);

}

export default router;