import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Homepage from './screen/homepage'
import dashboard from './screen'
import chat from ''
import footer from './components'
import Maincontent from './screen'

  const App = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({ name: '', description: '', price: '' });
    const [phoneNumber, setPhoneNumber] = useState(''); // WhatsApp phone number
  
    // Handle input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    };
  
    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      if (product.name && product.description && product.price && phoneNumber) {
        setProducts((prevProducts) => [...prevProducts, product]);
        setProduct({ name: '', description: '', price: '' });
      }
    };
  
    return (
      <div className="App">
        <nav className="bg-white shadow-md p-4 flex justify-between">
          <div className="text-2xl font-bold text-indigo-600">Ezuru</div>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-indigo-600">Home</a></li>
            <li><a href="#" className="hover:text-indigo-600">Features</a></li>
            <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
            <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
          </ul>
        </nav>
  
        <header className="bg-gradient-to-r from-yellow-400 to-red-500 text-white text-center p-16">
          <h1 className="text-4xl font-bold">Empower Your Business with Ezuru</h1>
          <p className="mt-4">The best way to bring your business online</p>
          <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Get Started</button>
        </header>
  
        <main className="p-8">
          {/* Product Posting Form */}
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
                <label className="block text-sm font-medium">Price</label>
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
  
            {/* Display Products */}
            <h2 className="text-2xl font-bold mt-8">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {products.map((product, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="font-bold">Price: ${product.price}</p>
                  <div className="mt-4 space-x-2">
                    {/* Site Chat Button */}
                    <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                      Chat on Site
                    </button>
                    {/* WhatsApp Chat Button */}
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
    );
  };
  
  export default App;