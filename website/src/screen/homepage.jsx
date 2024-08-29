import React from 'react'
import NavBar from '../components/NavBar'

const Homepage = () => {
  return (
   <div>
    <nav className='bg-white shadow-md p-4 flex justify-between'>
      <div className='text-2xl font-bold text-indigo-600'>Ezuru</div>
      <ul className='flex space-x-4'>
        <li><a href="/" className='hover:text-indigo-600'>Home</a></li>
        <li><a href="/dashboard" className='hover:text-indigo-600'>Dashboard</a></li>
        <li><a href="/chat" className='hover:text-indigo-600'>Chat</a></li>
      </ul>
    </nav>
    <header className='bg-gradient-to-r from-yellow-400 to-red-500 text-white text-center p-16'>
      <h1 className='text-4x1 font-bold'>Empower your business with Ezuru</h1>
      <p className='mt-4'>The best way to bring your business online</p>
      <button className='mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'>Get Started</button>
    </header>
   </div> 
  ) 
}

export default Homepage