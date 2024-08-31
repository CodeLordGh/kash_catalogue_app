import express, { Request, Response } from "express";

import { authenticateToken } from "../Utils/auth";
import { CustomRequest } from "./seller";
import { Order, Product } from "../Models/models";
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

      // Validate input
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid cart items" });
      }

      if (
        !userDetails ||
        // !userDetails.deliveryAddress ||
        !userDetails.phoneNumber
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user details" });
      }

      if (typeof totalPrice !== "number" || totalPrice <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid total price" });
      }

      // Validate and process cart items
      const orderItems = [];
      let calculatedTotal = 0;
      let seller;

      for (const item of cartItems) {
        if (!validateObjectId(item.product)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid product ID" });
        }

        const product = await Product.findById(item.product).populate("seller");
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.product}`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product: ${product.name}`,
          });
        }

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });

        calculatedTotal += product.price * item.quantity;

        // Update product stock
        const stockItem = product.stock.find(
          (itm) => itm.color === item.color
        );
        if (stockItem) {
          stockItem.qty -= item.quantity;
        } else {
          // Handle the case where the stock item is not found
          console.error(`Stock item not found for product ${product._id}`);
        }

        // Set the seller (assuming all products are from the same seller)
        if (!seller) {
          seller = (product as any).seller;
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
        seller: seller._id,
        items: orderItems,
        totalPrice: calculatedTotal,
        deliveryAddress: userDetails.deliveryAddress,
      });

      await order.save();

      // Initiate M-Pesa payment
      const paymentResult = await initiateMpesaPayment({
        phoneNumber: userDetails.phoneNumber,
        amount: calculatedTotal,
        orderId: order._id.toString(),
      });

      if (paymentResult.success) {
        res.status(201).json({
          success: true,
          message: "Order placed and payment initiated",
          orderId: order._id,
          checkoutRequestID: paymentResult.checkoutRequestID,
        });
      } else {
        // If payment initiation fails, delete the order
        await Order.findByIdAndDelete(order._id);
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

export default router;
