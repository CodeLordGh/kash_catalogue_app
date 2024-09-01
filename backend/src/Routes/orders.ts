import express, { Request, Response } from "express";
import { authenticateToken } from "../Utils/auth";
import { CustomRequest } from "./seller";
import { Catalog, Order, Product } from "../Models/models";
import { initiateMpesaPayment } from "../Services/payment";
import { validateObjectId } from "../Utils/validation";

const router = express.Router();

router.post(
  "/checkout",
  authenticateToken,
  async (req: CustomRequest, res: Response) => {
    try {
      const { cartItems, userDetails, totalPrice } = req.body;
      const buyer = req.user?.id;

      // console.log(cartItems, userDetails, totalPrice)

      // Validate input
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid cart items" });
      }

      // console.log("I reach here")

      if (!userDetails || !userDetails.phoneNumber) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user details" });
      }
      // console.log("I reach here")

      if (typeof totalPrice !== "number" || totalPrice <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid total price" });
      }

      // Validate and process cart items
      const orderItems = [];
      let calculatedTotal = 0;
      let catalog;

      // console.log("I reach here")

      for (const item of cartItems) {
        if (!validateObjectId(item.product)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid product ID" });
        }

        const product = await Product.findById(item.product).populate(
          "catalog"
        );
        // console.log(product?._id)
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.product}`,
          });
        }

        // Check stock for specific color and size
        const stockItem = product.stock.find(
          (stockItem) => stockItem.color === item.color // && stockItem.size === item.size
        );

        // console.log(stockItem, item.color);

        if (!stockItem || stockItem.qty < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product: ${product.name}, Color: ${item.color}, Size: ${item.size}`,
          });
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          color: item.color,
          size: item.size,
        });
        // console.log("I reach here");

        calculatedTotal += product.price * item.quantity;

        // Update product stock
        stockItem.qty -= item.quantity;
        await product.save();

        // Set the seller (assuming all products are from the same seller)
        if (!catalog) {
          catalog = (product as any).catalog;
        }
      }

      // Verify total price
      if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
        return res
          .status(400)
          .json({ success: false, message: "Total price mismatch" });
      }

      // Create order
      const order = new Order({
        buyer,
        seller: catalog._id,
        items: orderItems,
        totalPrice: calculatedTotal,
        deliveryAddress: userDetails.deliveryAddress || "",
        phoneNumber: userDetails.phoneNumber,
      });

      await order.save();

      // Initiate M-Pesa payment
      const paymentResult = await initiateMpesaPayment({
        phoneNumber: userDetails.phoneNumber,
        amount: calculatedTotal,
        orderId: order._id.toString(),
      });

      if (paymentResult.success) {
        order.checkoutRequestID  = paymentResult.checkoutRequestID as any
        await order.save();

        res.status(201).json({
          success: true,
          message: "Order placed and payment initiated",
          orderId: order._id,
          checkoutRequestID: paymentResult.checkoutRequestID,
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
      res
        .status(500)
        .json({ success: false, message: "An error occurred during checkout" });
    }
  }
);

router.post("/mpesa/callback", async (req: Request, res: Response) => {
  try {
    const {
      Body: {
        stkCallback: {
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata,
        },
      },
    } = req.body;

    console.log("M-Pesa Callback Received:", JSON.stringify(req.body, null, 2));

    if (ResultCode === 0) {
      // Payment successful
      const amount = CallbackMetadata.Item.find(
        (item: any) => item.Name === "Amount"
      ).Value;
      const mpesaReceiptNumber = CallbackMetadata.Item.find(
        (item: any) => item.Name === "MpesaReceiptNumber"
      ).Value;
      const transactionDate = CallbackMetadata.Item.find(
        (item: any) => item.Name === "TransactionDate"
      ).Value;
      const phoneNumber = CallbackMetadata.Item.find(
        (item: any) => item.Name === "PhoneNumber"
      ).Value;

      // Find the order using the CheckoutRequestID
      const order = await Order.findOne({
        checkoutRequestID: CheckoutRequestID,
      });

      console.log("I am here");

      if (order) {
        // Update order status
        order.paymentStatus = "completed";
        order.mpesaReceiptNumber = mpesaReceiptNumber;
        order.transactionDate = transactionDate;
        order.paidAmount = amount;
        order.payerPhoneNumber = phoneNumber;

        await order.save();

        console.log(`Payment completed for order ${order._id}`);
      } else {
        console.error(
          `Order not found for CheckoutRequestID: ${CheckoutRequestID}`
        );
      }
    } else {
      // Payment failed
      console.error(`Payment failed: ${ResultDesc}`);

      // Find the order using the CheckoutRequestID
      const order = await Order.findOne({
        checkoutRequestID: CheckoutRequestID,
      });

      if (order) {
        // Update order status to failed
        order.paymentStatus = "failed";
        order.paymentFailureReason = ResultDesc;

        await order.save();

        console.log(`Payment failed for order ${order._id}`);
      } else {
        console.error(
          `Order not found for CheckoutRequestID: ${CheckoutRequestID}`
        );
      }
    }

    // Always respond with a success to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: "Callback received successfully" });
  } catch (error) {
    console.error("Error processing M-Pesa callback:", error);
    res
      .status(500)
      .json({ ResultCode: 1, ResultDesc: "Internal server error" });
  }
});

router.get(
  "/payment-status/:orderId/:checkoutRequestID",
  async (req: Request, res: Response) => {
    try {
      const { orderId, checkoutRequestID } = req.params;

      const order = await Order.findOne({ _id: orderId, checkoutRequestID });

      // console.log(order);

      if (!order) {
        return res
          .status(404)
          .json({ status: "error", message: "Order not found" });
      }

      let status;
      switch (order.paymentStatus) {
        case "completed":
          status = "completed";
          break;
        case "failed":
          status = "failed";
          break;
        default:
          status = "pending";
      }

      status = "completed"

      res.json({
        status,
        orderDetails:
          status === "completed"
            ? {
                orderId: order._id,
                totalAmount: order.totalPrice,
                items: order.items,
                mpesaReceiptNumber: order.mpesaReceiptNumber,
                transactionDate: order.transactionDate,
              }
            : null,
      });
    } catch (error) {
      console.error("Error checking payment status:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
);


router.get('/orders', authenticateToken, async (req: CustomRequest, res: Response) => {
  
  try {
    // The authenticateToken middleware should attach the user to the request
    const catalog = await Catalog.find({seller: req.user?.id}) ;

    if (!catalog) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Fetch orders for the vendor
    const orders = await Order.find({ seller: catalog })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .populate('buyer', 'fullName email') // Populate buyer information
      .populate('items.product', 'name price'); // Populate product information

      // console.log((orders as any))
      console.log((orders as any)[0].items)


    // Transform the orders to include only necessary information
    const transformedOrders = orders.map(order => ({
      id: order._id,
      buyerName: (order.buyer as any).fullName,
      buyerEmail: (order.buyer as any).email,
      totalPrice: order.totalPrice,
      status: order.paymentStatus,
      createdAt: (order as any).createdAt,
      items: order.items.map(item => ({
        productName: (item as any).product.name,
        quantity: item.quantity,
        price: item.price,
        // color: (item as any).color,
        // size: (item as any).size,
      })),
      deliveryAddress: order.deliveryAddress,
      // mpesaReceiptNumber: order.mpesaReceiptNumber,
      // transactionDate: order.transactionDate,
    }));

    res.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
