import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Seller } from '../Models/models';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';

export const authenticateToken = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    
    if (!decoded.id) {
      return res.sendStatus(403);
    }

    const seller = await Seller.findById(decoded.id);

    if (!seller || seller.tokenBlacklist.includes(token)) {
      return res.sendStatus(403);
    }

    req.user = { id: seller._id.toString() };
    req.token = token;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};


// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };