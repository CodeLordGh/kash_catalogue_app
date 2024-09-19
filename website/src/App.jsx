import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './screen/homepage';
import Dashboard from './screen/dashboard';
import Chat from './screen/chat';
import Footer from './components/Footer';
import Maincontent from './screen/maincontent';

// Currency data for different countries

const App = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({ name: '', description: '', price: '' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vendors, setVendors] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [currency, setCurrency] = useState('NGN'); // Default currency is Nigerian Naira
  const [exchangeRates, setExchangeRates] = useState({
    NGN: { symbol: '₦', rate: 1 }, // Nigerian Naira (default)
  USD: { symbol: '$', rate: 0.0027 }, // US Dollar
  EUR: { symbol: '€', rate: 0.0025 }, // Euro
  GBP: { symbol: '£', rate: 0.0022 }, // British Pound
  KES: { symbol: 'KSh', rate: 0.37 }, // Kenyan Shilling
  ZAR: { symbol: 'R', rate: 0.05 }, // South African Rand
  GHS: { symbol: '₵', rate: 0.03 }, // Ghanaian Cedi
  // Add more currencies if needed
  }); // Example fixed exchange rates for different countries

  const COMMISSION_RATE = 0.02; // 2% commission rate

  // Function to handle input changes for product form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Function to calculate price with commission
  const calculatePriceWithCommission = (price) => {
    return parseFloat(price) * (1 + COMMISSION_RATE);
  };

  // Convert price to the selected currency
  const convertPrice = (price, currency) => {
    return (price * exchangeRates[currency]).toFixed(2);
  };

  // Handle form submission for adding a product
  const handleSubmit = (e) => {
    e.preventDefault();
    if (product.name && product.description && product.price && phoneNumber) {
      const priceWithCommission = calculatePriceWithCommission(product.price);
      const newProduct = {
        ...product,
        price: priceWithCommission.toFixed(2),
      };
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setProduct({ name: '', description: '', price: '' });
    }
  };

  // Handle subscription to premium plan
  const handleSubscribe = () => {
    setIsPremium(true);
    alert('You have successfully subscribed to the premium plan!');
  };

  // Handle unsubscription from premium plan
  const handleUnsubscribe = () => {
    setIsPremium(false);
    alert('You have successfully unsubscribed from the premium plan.');
  };

  // Handle currency change
  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };
  

  return (
    <Router>
      <div className="App">
        <nav className="bg-white shadow-md p-4 flex justify-between">
          <div className="text-2xl font-bold text-indigo-600">Ezuru</div>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-indigo-600">Home</a></li>
            <li><a href="#" className="hover:text-indigo-600">Features</a></li>
            <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
            <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
          </ul>
          <div>
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="border rounded px-2 py-1"
            >
              <option value="NGN">NGN - Naira</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="GHS">GHS - Ghanaian Cedi</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="ZAR">ZAR - South African Rand</option>
            </select>
          </div>
        </nav>

        <header className="bg-gradient-to-r from-yellow-400 to-red-500 text-white text-center p-16">
          <h1 className="text-4xl font-bold">Empower Your Business with Ezuru</h1>
          <p className="mt-4">The best way to bring your business online</p>
          <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Get Started</button>
        </header>

        <main className="p-8">
          <div className="p-6 bg-gray-100 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-4">Manage Your Subscription</h2>
            {!isPremium ? (
              <button onClick={handleSubscribe} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Subscribe to Premium
              </button>
            ) : (
              <>
                <p className="text-green-600 font-bold mb-4">You are a premium subscriber!</p>
                <button onClick={handleUnsubscribe} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                  Unsubscribe
                </button>
              </>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Post a Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 w-full"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium">Price (in Naira)</label>
                <input
                  type="text"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">WhatsApp Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your WhatsApp number"
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                Post Product
              </button>
            </form>

            <h2 className="text-2xl font-bold mt-8">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {products.map((product, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="font-bold">Price: {currency} {convertPrice(product.price, currency)}</p>
                  <div className="mt-4 space-x-2">
                    <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                      Chat on Site
                    </button>
                    <a
                      href={`https://wa.me/${phoneNumber}?text=I'm%20interested%20in%20your%20product:%20${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="bg-gray-200 text-center p-4">
          <p>&copy; 2024 Ezuru - Empowering Your Online Business</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;