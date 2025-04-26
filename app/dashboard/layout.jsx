import React from 'react';
import Header from './_components/Header';


function dashboardLayout({children}) {
  return (
    <div>
      <Header/>
      <div className='mx-5  md:mx-20 lg:mx-35'>
        {children}</div>
    </div>
  )
}

export default dashboardLayout
