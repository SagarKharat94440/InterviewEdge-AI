"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation' 



function Header() {
  const router = useRouter();
    const path = usePathname();
    useEffect(()=> {
        console.log(path)
    },[])
    
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
        <Image src={'/logo.png'} width={160} height={100} alt='logo'/>
        <ul className='hidden md:flex gap-6'>
  <li
    className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
      ${path == '/dashboard' ? 'text-primary font-bold' : ''}`}
      onClick={() => router.push('/dashboard')}
  >
    Dashboard
  </li>
  <li
    className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
      ${path == '/questions' ? 'text-primary font-bold' : ''}`}
  >
    Questions
  </li>
  <li
    className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
      ${path =='/upgrade' ? 'text-primary font-bold' : ''}`}
  >
    Upgrade
  </li>
  <li
    className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
      ${path =='/how' ? 'text-primary font-bold' : ''}`}
  >
    How it Works?
  </li>
</ul>

        <UserButton/>
    </div>   
  )
}

export default Header