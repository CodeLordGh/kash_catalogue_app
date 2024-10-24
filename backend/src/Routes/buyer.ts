import express from 'express';
import {
  registerBuyer,
  updateBuyerProfile,
  viewCatalog,
  addToCart,
  removeFromCart,
  viewCart,
  createOrder,
  getOrderHistory,
  getOrderDetails,
  loginBuyer
} from '../Services/buyerService';
import { generateAccessToken } from './seller';
import { authenticateToken } from '../Utils/auth';
import { validateAccountHolderStatus, getBasicUserInfo } from '../Services/mtnService';

interface CustomRequest extends express.Request {
  buyerId?: string;
  user?: { id: string };
}

const router = express.Router();

// Middleware to extract buyerId from headers or query params
const extractedId = (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  const buyerId = req.headers['buyer-id'] as string || req.query.buyerId as string;

  if (!buyerId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  req.buyerId = buyerId;
  next();
};

// login
router.post("/login", async (req, res) => {
  const { input, fcmToken } = req.body;

  // Input validation: Check if input is a 6-digit string
  if (!/^\d{6}$/.test(input)) {
    return res.status(400).json({ error: "User Id must be a 6-digit string." });
  }
  const user = await loginBuyer(input, fcmToken);

    // Check if user is null or undefined
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

  const accessToken = generateAccessToken(user._id);
  

  res.status(200).json({user, accessToken});
})

// Register a new buyer
router.post('/register', async (req, res) => {
  try {
    const { storeId } = req.body;
    console.log('Registering buyer for store:', storeId);
    const result = await registerBuyer(storeId);
    console.log('Registration result:', result);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error registering buyer:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message, stack: error.stack });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
});

// Update buyer profile
router.put('/buyer/profile', authenticateToken, async (req: CustomRequest, res) => {
  try {
    const { fullName, phoneNumber, serviceProvider } = req.body;
    const buyerId = req.user?.id;

    console.log('Received update request:', { fullName, phoneNumber, serviceProvider, buyerId });

    if (!buyerId) {
      console.log('User ID is missing');
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!fullName || !phoneNumber || !serviceProvider) {
      return res.status(400).json({ message: 'Full name, phone number, and service provider are required' });
    }

    // Validate account holder status
    const isActive = await validateAccountHolderStatus(phoneNumber);
    if (!isActive) {
      return res.status(400).json({ message: 'The provided phone number is not active, registered, or could not be verified' });
    }

    // Get basic user info
    try {
      const userInfo = await getBasicUserInfo(phoneNumber);
      if (userInfo.name.toLowerCase() !== fullName.toLowerCase() && userInfo.name !== "Sand Box") {
        console.log(fullName, userInfo.name)
        return res.status(400).json({ 
          message: 'The provided name does not match the name registered with the phone number',
          registeredName: userInfo.name
        });
      }
    } catch (error) {
      console.error('Error getting basic user info:', error);
      return res.status(400).json({ message: 'Unable to verify user information' });
    }

    // Update user profile
    await updateBuyerProfile(buyerId, { fullName, phoneNumber, serviceProvider });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'An error occurred while updating the profile' });
  }
}); 

// View catalog
router.get('/catalog/:storeId', async (req:CustomRequest, res) => {
  try {
    const { storeId } = req.params;
    const catalog = await viewCatalog(req.buyerId? req.buyerId: "", storeId);
    res.status(200).json(catalog);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Add to cart
router.post('/cart', async (req:CustomRequest, res) => {
  try {
    const { productId, quantity } = req.body;
    await addToCart(req.buyerId? req.buyerId: "", productId, quantity);
    res.status(200).json({ message: 'Product added to cart' });
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
});

// Remove from cart
router.delete('/cart/:productId', async (req:CustomRequest, res) => {
  try {
    const { productId } = req.params;
    await removeFromCart(req.buyerId? req.buyerId: "", productId);
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
});

// View cart
router.get('/cart', async (req:CustomRequest, res) => {
  try {
    const cart = await viewCart(req.buyerId? req.buyerId: "");
    res.status(200).json(cart);
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
});

// Create order
router.post('/order', async (req:CustomRequest, res) => {
  try {
    const { deliveryAddress } = req.body;
    const result = await createOrder(req.buyerId? req.buyerId: "", deliveryAddress);
    res.status(201).json(result);
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
});

// Get order history
// router.get('/orders', async (req:CustomRequest, res) => {
//   try {
//     const orders = await getOrderHistory(req.buyerId? req.buyerId: "");
//     res.status(200).json(orders);
//   } catch (error:any) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Get order details
router.get('/orders/:orderId', async (req:CustomRequest, res) => {
  try {
    const { orderId } = req.params;
    const orderDetails = await getOrderDetails(req.buyerId? req.buyerId: "", orderId);
    if (!orderDetails) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(orderDetails);
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
});
router.post('/logout',authenticateToken, (req, res) => {
  res.sendStatus(200); 
})

export default router;
