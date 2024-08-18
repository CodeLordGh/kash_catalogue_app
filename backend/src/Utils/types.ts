import { ObjectId } from 'mongodb';

export interface Store {
  _id: ObjectId;
  name: string;
  description: string;
  owner: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  catalog: CatalogItem[];
  deliveryZones: DeliveryZone[];
  customerCodes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CatalogItem {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryZone {
  _id: ObjectId;
  name: string;
  description: string;
  fee: number;
  estimatedDeliveryTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  _id: ObjectId;
  phoneNumber: string;
  name?: string;
  email?: string;
  addresses: Address[];
  orders: Order[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Order {
  _id: ObjectId;
  customerId: ObjectId;
  storeId: ObjectId;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: Address;
  deliveryFee: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  catalogItemId: ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}