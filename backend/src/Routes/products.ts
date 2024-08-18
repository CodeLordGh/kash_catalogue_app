import express from 'express';
import { Request, Response } from 'express';
// import { authenticateToken } from './middleware/auth';
import { Catalog, Product, Seller } from '../Models/models';
import { authenticateToken } from '../Utils/auth';

const router = express.Router();

// Create Product
router.post('/product', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { name, description, price } = req.body;
      const sellerId = req.user?.id;
  
      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      const newProduct = new Product({
        name,
        description,
        price,
        catalog: seller.catalog
      });
  
      await newProduct.save();
  
      // Add product to catalog
      await Catalog.findByIdAndUpdate(seller.catalog, {
        $push: { products: newProduct._id }
      });
  
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error });
    }
  });
  
  // Read Products
  router.get('/products', authenticateToken, async (req: Request, res: Response) => {
    try {
      const sellerId = req.user?.id;
      const seller = await Seller.findById(sellerId).populate('catalog');
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      const products = await Product.find({ catalog: seller.catalog });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  });
  
  // Update Product
  router.put('/product/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;
      const sellerId = req.user?.id;
  
      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      const product = await Product.findOneAndUpdate(
        { _id: id, catalog: seller.catalog },
        { name, description, price },
        { new: true }
      );
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error });
    }
  });
  
  // Delete Product
  router.delete('/product/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const sellerId = req.user?.id;
  
      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      const product = await Product.findOneAndDelete({ _id: id, catalog: seller.catalog });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Remove product from catalog
      await Catalog.findByIdAndUpdate(seller.catalog, {
        $pull: { products: id }
      });
  
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error });
    }
  });

