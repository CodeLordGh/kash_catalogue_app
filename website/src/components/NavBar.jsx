import React from 'react'

const NavBar = () => {
  return (
    <div className='flex justify-between px-6 h-[10vh] items-center bg-red-400'>
        <h1 className='cursor-pointer'>
        Ezuru
        </h1>
        <ul className='flex gap-x-5'>
            <li className='cursor-pointer hover:underline' >Home</li>
            <li className='cursor-pointer hover:underline' >Services</li>
            <li className='cursor-pointer hover:underline' >About Us</li>
        </ul>
    </div>
  )
}

export default NavBar