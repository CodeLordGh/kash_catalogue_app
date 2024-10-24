import express, { Request, Response } from "express";
import { authenticateToken } from "../Utils/auth";
import { CustomRequest } from "./seller";
import { Catalog, Order, Product, Payment } from "../Models/models";
import { initiateMtnPayment, checkMtnPaymentStatus } from "../Services/payment";
import { validateObjectId } from "../Utils/validation";

const router = express.Router();

// Helper function to validate cart items
const validateCartItems = async (cartItems: any[]) => {
  const orderItems = [];
  let calculatedTotal = 0;
  let catalog;

  for (const item of cartItems) {
    if (!validateObjectId(item.product)) {
      throw new Error("Invalid product ID");
    }

    const product = await Product.findById(item.product).populate("catalog");
    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }

    const stockItem = product.stock.find(
      (stockItem) => stockItem.color === item.color && stockItem.size === item.size
    );

    if (!stockItem || stockItem.qty < item.quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}, Color: ${item.color}, Size: ${item.size}`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      color: item.color,
      size: item.size,
    });

    calculatedTotal += product.price * item.quantity;

    if (!catalog) {
      catalog = product.catalog;
    }
  }

  return { orderItems, calculatedTotal, catalog };
};

// Helper function to update product stock
const updateProductStock = async (orderItems: any[]) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      const stockItem = product.stock.find(
        (stockItem) => stockItem.color === item.color && stockItem.size === item.size
      );
      if (stockItem) {
        stockItem.qty -= item.quantity;
        await product.save();
      }
    }
  }
};

router.post(
  "/checkout",
  authenticateToken,
  async (req: CustomRequest, res: Response) => {
    try {
      const { cartItems, userDetails, totalPrice } = req.body;
      const buyer = req.user?.id;

      // Validate input
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid cart items" });
      }

      if (!userDetails || !userDetails.phoneNumber) {
        return res.status(400).json({ success: false, message: "Invalid user details" });
      }

      if (typeof totalPrice !== "number" || totalPrice <= 0) {
        return res.status(400).json({ success: false, message: "Invalid total price" });
      }

      // Validate and process cart items
      const { orderItems, calculatedTotal, catalog } = await validateCartItems(cartItems);

      // Verify total price
      if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
        return res.status(400).json({ success: false, message: "Total price mismatch" });
      }

      // Create order
      const order = new Order({
        buyer,
        seller: catalog?._id,
        items: orderItems,
        totalPrice: calculatedTotal,
        deliveryAddress: userDetails.deliveryAddress || "",
        phoneNumber: userDetails.phoneNumber,
      });

      await order.save();

      // Initiate MTN payment
      const paymentResult = await initiateMtnPayment({
        phoneNumber: userDetails.phoneNumber,
        amount: calculatedTotal,
        orderId: order._id.toString(),
      });

      if (paymentResult.success) {
        order.paymentRequestId = paymentResult.paymentRequestId as any;
        await order.save();

        // Update product stock
        await updateProductStock(orderItems);

        res.status(201).json({
          success: true,
          message: "Order placed and payment initiated",
          orderId: order._id,
          paymentRequestId: paymentResult.paymentRequestId,
        });
      } else {
        // If payment initiation fails, delete the order
        await Order.findByIdAndDelete(order._id);

        console.log(paymentResult.error);
        res.status(400).json({
          success: false,
          message: "Failed to initiate payment",
          error: paymentResult.error,
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ success: false, message: "An error occurred during checkout" });
    }
  }
);

router.get(
  "/payment-status/:orderId/:paymentRequestId",
  async (req: Request, res: Response) => {
    try {
      const { orderId, paymentRequestId } = req.params;

      const order = await Order.findOne({ _id: orderId, paymentRequestId });

      if (!order) {
        return res.status(404).json({ status: "error", message: "Order not found" });
      }

      const paymentStatus = await checkMtnPaymentStatus(paymentRequestId);

      if (paymentStatus.success) {
        if (paymentStatus.status === 'completed') {
          order.paymentStatus = "completed";
          order.transactionId = paymentStatus.transactionId;
          await order.save();

          // Save payment details to the new Payment collection
          const paymentDetails = paymentStatus.paymentDetails;
          const payment = new Payment({
            order: order._id,
            financialTransactionId: paymentDetails.financialTransactionId,
            externalId: paymentDetails.externalId,
            amount: paymentDetails.amount,
            currency: paymentDetails.currency,
            payer: paymentDetails.payer,
            payerMessage: paymentDetails.payerMessage,
            payeeNote: paymentDetails.payeeNote,
            status: paymentDetails.status,
          });
          await payment.save();

          return res.json({
            status: "completed",
            orderDetails: {
              orderId: order._id,
              totalAmount: order.totalPrice,
              items: order.items,
              transactionId: order.transactionId,
              transactionDate: (order as any).updatedAt,
            },
          });
        } else if (paymentStatus.status === 'pending') {
          return res.json({ status: "pending" });
        }
      }

      // Handle failed or error cases
      order.paymentStatus = "failed";
      order.paymentFailureReason = paymentStatus.error || "Unknown error";
      await order.save();

      let statusCode = 400;
      if (paymentStatus.status === 'not_found') statusCode = 404;
      if (paymentStatus.status === 'api_error') statusCode = 502;
      if (paymentStatus.status === 'network_error') statusCode = 503;

      return res.status(statusCode).json({ 
        status: "failed", 
        error: paymentStatus.error || "Payment failed",
        errorType: paymentStatus.status
      });

    } catch (error) {
      console.error("Error checking payment status:", error);
      res.status(500).json({ 
        status: "error", 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

router.get('/orders', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const catalog = await Catalog.findOne({ seller: req.user?.id });

    if (!catalog) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const orders = await Order.find({ seller: catalog._id })
      .sort({ createdAt: -1 })
      .populate('buyer', 'fullName email')
      .populate('items.product', 'name price');

    if (orders.length === 0) {
      return res.json([]);
    }

    const transformedOrders = orders.map(order => ({
      id: order._id,
      buyerName: (order.buyer as any).fullName || 'Unknown',
      buyerEmail: (order.buyer as any).email || 'Unknown',
      totalPrice: order.totalPrice,
      status: order.paymentStatus,
      createdAt: (order as any).createdAt,
      items: order.items.map(item => ({
        productName: (item.product as any).name || 'Unknown',
        quantity: item.quantity,
        price: item.price,
      })),
      deliveryAddress: order.deliveryAddress,
    }));

    res.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
