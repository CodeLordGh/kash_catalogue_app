import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Buyer, Seller } from '../Models/models';
import mongoose from 'mongoose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';

export const authenticateToken = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;

    if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.sendStatus(403); // Forbidden
    }

    const seller = await Seller.findById(decoded.id);
    let buyer;

    if (!seller || seller.tokenBlacklist.includes(token)) {
      buyer = await Buyer.findById(decoded.id) as any;
    }

    if (!seller && !buyer) {
      return res.sendStatus(403); // Forbidden if neither seller nor buyer is found
    }

    req.user = seller ? 
      { id: seller._id.toString(), senderModel: "Seller", receiverModel: "Buyer" } : 
      { id: buyer._id.toString(), senderModel: "Buyer", receiverModel: "Seller" };
      
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.sendStatus(403); // Forbidden
  }
};