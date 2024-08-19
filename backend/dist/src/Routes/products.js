"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { authenticateToken } from './middleware/auth';
const models_1 = require("../Models/models");
const auth_1 = require("../Utils/auth");
const router = express_1.default.Router();
// Create Product
router.post('/product', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, price, stock } = req.body;
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const seller = yield models_1.Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        const newProduct = new models_1.Product({
            name,
            description,
            price,
            stock,
            catalog: seller.catalog
        });
        yield newProduct.save();
        // Add product to catalog
        yield models_1.Catalog.findByIdAndUpdate(seller.catalog, {
            $push: { products: newProduct._id }
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
}));
// Read Products
router.get('/products', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const seller = yield models_1.Seller.findById(sellerId).populate('catalog');
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        const products = yield models_1.Product.find({ catalog: seller.catalog });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
}));
// Update Product
router.put('/product/:id', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const seller = yield models_1.Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        const product = yield models_1.Product.findOneAndUpdate({ _id: id, catalog: seller.catalog }, { name, description, price }, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
}));
// Delete Product
router.delete('/product/:id', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const seller = yield models_1.Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        const product = yield models_1.Product.findOneAndDelete({ _id: id, catalog: seller.catalog });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Remove product from catalog
        yield models_1.Catalog.findByIdAndUpdate(seller.catalog, {
            $pull: { products: id }
        });
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
}));
router.get('/product/:id', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const seller = yield models_1.Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        const product = yield models_1.Product.findOne({ _id: id, catalog: seller.catalog });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ product });
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting product', error });
    }
}));
// import express, { Request, Response } from 'express';
// import { ObjectId } from 'mongodb';
// import { 
//   addCatalogItem, 
//   updateCatalogItem, 
//   deleteCatalogItem, 
//   addDeliveryZone, 
//   updateDeliveryZone, 
//   deleteDeliveryZone,
//   generateCustomerCode
// } from './storeService'; // Assume these functions are implemented in a separate file
// const router = express.Router();
// // Create a new store
// router.post('/stores', async (req: Request, res: Response) => {
//   const storeData = req.body;
//   const result = await createStore(storeData);
//   res.status(201).json(result);
// });
// // Update a store
// router.put('/stores/:id', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const storeData = req.body;
//   const result = await updateStore(new ObjectId(id), storeData);
//   res.json(result);
// });
// // Delete a store
// router.delete('/stores/:id', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await deleteStore(new ObjectId(id));
//   res.json(result);
// });
// // Add a catalog item
// router.post('/stores/:id/catalog', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const itemData = req.body;
//   const result = await addCatalogItem(new ObjectId(id), itemData);
//   res.status(201).json(result);
// });
// // Update a catalog item
// router.put('/stores/:storeId/catalog/:itemId', async (req: Request, res: Response) => {
//   const { storeId, itemId } = req.params;
//   const itemData = req.body;
//   const result = await updateCatalogItem(new ObjectId(storeId), new ObjectId(itemId), itemData);
//   res.json(result);
// });
// // Delete a catalog item
// router.delete('/stores/:storeId/catalog/:itemId', async (req: Request, res: Response) => {
//   const { storeId, itemId } = req.params;
//   const result = await deleteCatalogItem(new ObjectId(storeId), new ObjectId(itemId));
//   res.json(result);
// });
// // Add a delivery zone
// router.post('/stores/:id/delivery-zones', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const zoneData = req.body;
//   const result = await addDeliveryZone(new ObjectId(id), zoneData);
//   res.status(201).json(result);
// });
// // Update a delivery zone
// router.put('/stores/:storeId/delivery-zones/:zoneId', async (req: Request, res: Response) => {
//   const { storeId, zoneId } = req.params;
//   const zoneData = req.body;
//   const result = await updateDeliveryZone(new ObjectId(storeId), new ObjectId(zoneId), zoneData);
//   res.json(result);
// });
// // Delete a delivery zone
// router.delete('/stores/:storeId/delivery-zones/:zoneId', async (req: Request, res: Response) => {
//   const { storeId, zoneId } = req.params;
//   const result = await deleteDeliveryZone(new ObjectId(storeId), new ObjectId(zoneId));
//   res.json(result);
// });
// // Generate a customer code
// router.post('/stores/:id/generate-code', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await generateCustomerCode(new ObjectId(id));
//   res.status(201).json(result);
// });
// export default router;
// import { Collection, Db, ObjectId } from 'mongodb';
// import { Store, CatalogItem, DeliveryZone } from './types'; // Assume these types are defined in a separate file
// let db: Db;
// export const initializeDB = (database: Db) => {
//   db = database;
// };
// const getStoreCollection = (): Collection<Store> => db.collection('stores');
// export const createStore = async (storeData: Omit<Store, '_id'>): Promise<Store> => {
//   const collection = getStoreCollection();
//   const result = await collection.insertOne(storeData);
//   return { ...storeData, _id: result.insertedId };
// };
// export const updateStore = async (id: ObjectId, storeData: Partial<Store>): Promise<Store | null> => {
//   const collection = getStoreCollection();
//   const result = await collection.findOneAndUpdate(
//     { _id: id },
//     { $set: storeData },
//     { returnDocument: 'after' }
//   );
//   return result.value;
// };
// export const deleteStore = async (id: ObjectId): Promise<boolean> => {
//   const collection = getStoreCollection();
//   const result = await collection.deleteOne({ _id: id });
//   return result.deletedCount === 1;
// };
// export const addCatalogItem = async (storeId: ObjectId, itemData: Omit<CatalogItem, '_id'>): Promise<Store | null> => {
//   const collection = getStoreCollection();
//   const result = await collection.findOneAndUpdate(
//     { _id: storeId },
//     { $push: { catalog: { ...itemData, _id: new ObjectId() } } },
//     { returnDocument: 'after' }
//   );
//   return result.value;
// };
// export const updateCatalogItem = async (storeId: ObjectId, itemId: ObjectId, itemData: Partial<CatalogItem>): Promise<Store | null> => {
//   const collection = getStoreCollection();
//   const result = await collection.findOneAndUpdate(
//     { _id: storeId, 'catalog._id': itemId },
//     { $set: { 'catalog.$': { ...itemData, _id: itemId } } },
//     { returnDocument: 'after' }
//   );
//   return result.value;
// };
// export const deleteCatalogItem = async (storeId: ObjectId, itemId: ObjectId): Promise<Store | null> => {
//   const collection = getStoreCollection();
//   const result = await collection.findOneAndUpdate(
//     { _id: storeId },
//     { $pull: { catalog: { _id: itemId } } },
//     { returnDocument: 'after' }
//   );
//   return result.value;
// };
// export const addDeliveryZone = async (storeId: ObjectId, zoneData: Omit<DeliveryZone, '_id'>): Promise<Store | null> => {
//   const collection = getStoreCollection();
//   const result = await collection.findOneAndUpdate(
//     { _id: storeId },
//     { $push: { deliveryZones: { ...zoneData, _id: new ObjectId() } } },
//     { returnDocument: 'after' }
//   );
//   return result.value;
// };
// export const updateDeliveryZone = async (storeId: ObjectId, zoneId: ObjectId, zoneData: Partial<DeliveryZone>): Promise<Store | null> => {
//   const collection = getStoreCollection();
//   const result = await collection.findOneAndUpdate(
//     { _id: storeId, 'deliveryZones._id': zoneId },
//     { $set: { 'deliveryZones.$': { ...zoneData, _id: zoneId } } },
//     { returnDocument: 'after' }
//   );
//   return result.value;
// };
exports.default = router;
