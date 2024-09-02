import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Homepage from './screen/homepage'
import dashboard from './screen'
import chat from ''
import footer from './components'
import Maincontent from './screen'

function App() {
  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between">
        <div className="text-2xl font-bold text-indigo-600">Ezuru</div>
        <ul className="flex space-x-4">
          <li><a href="#" className="hover:text-indigo-600">Home</a></li>
          <li><a href="#" className="hover:text-indigo-600">Features</a></li>
          <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
          <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
        </ul>
      </nav>

      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 to-red-500 text-white text-center p-16">
        <h1 className="text-4xl font-bold">Empower Your Business with Ezuru</h1>
        <p className="mt-4">The best way to bring your business online</p>
        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button>
      </header>

      {/* Features Section */}
      <section className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">Easy Store Setup</h3>
            <p>Create your online store with just a few clicks.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">Catalog Upload</h3>
            <p>Upload and manage your product catalog easily.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">Multi-Channel Chat</h3>
            <p>Chat with customers via system messages and WhatsApp.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">Vendor Dashboard</h3>
            <p>Manage your business from our comprehensive dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;