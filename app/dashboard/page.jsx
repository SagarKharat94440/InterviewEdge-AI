import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from'./_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function dashboardPage() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2 className='text-gray-500'>Craete  and start your AI  Mock interview</h2> 
      <div className='grid grid-cols-1 md:grid-cols-3 my-0.5'>
          <AddNewInterview/>
      </div>
      <div>
       <InterviewList/>
      </div>
    </div>
  )
}

export default dashboardPage
