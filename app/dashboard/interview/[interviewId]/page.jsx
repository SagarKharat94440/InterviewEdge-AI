"use client"
import React, {use, useEffect, useState} from 'react'
import { db } from '../../../../utils/db'
import { MockInterview } from '../../../../utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Webcam from "react-webcam";
import { Button } from '../../../../components/ui/button'
import Link from 'next/link'


function interview({params}) {
  const param= use(params);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [interviewData, setInterviewData]= useState([]);
  useEffect(()=>{
   console.log(param.interviewId)
    GetInterviewDetails()
  },[])

  const GetInterviewDetails=async()=>{
    const result = await db.select().from(MockInterview)
    .where(eq(MockInterview.mockId, param.interviewId))
    setInterviewData(result[0])
    console.log(result[0]);
  }
  return (
    <div className='my-10 '>
       <h2 className='font-bold text-2xl'>Let's Get Started</h2>
       <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
       <div className='flex flex-col my-5 gap-5 '>
        <div className='flex flex-col p-5 rounded-lg border gap-5'>
         <h2 className='text-lg'><strong>Job Role/Job Position: </strong>{interviewData.jobPosition}</h2>
         <h2 className='text-lg'><strong>Job Descriptio/Teck Stack: </strong>{interviewData.jobDesc}</h2>
         <h2 className='text-lg'><strong>Job Experience: </strong>{interviewData.jobExperience}</h2>
       </div>
       <div className='p-5 bord rounded-lg border-yellow-300 bg-yellow-100'>
        <h2 className='flex gap-2 items-center text-yellow-500 '><Lightbulb/><strong>Information</strong></h2>
        <h2 className='mt-3 text-yellow-500'>Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview, It Has 5 question which you can answer and at the last you will get the report on the basis of your answer. NOTE: We never record your video , Web cam access you can disable at any time if you want</h2>
       </div>

       </div>

       <div>
          {webCamEnabled? <Webcam 
          onUserMedia={()=>setWebCamEnabled(true)}
          onUserMediaError={()=>setWebCamEnabled(false)}
          mirrored={true}
          style={{
            height:300,
            width:300
          }} 
          />
          :
          <>
         <WebcamIcon className='h-72 w-full my-7 p-22 bg-secondary rounded-lg border'/>
         <Button variant='ghost' className="cursor-pointer" onClick={()=>setWebCamEnabled(true)}>Enable Web Camera and Microphone</Button>
         </>
        }
       </div>

       </div>
       <div className='flex justify-end items-end '>
        <Link href={'/dashboard/interview/'+param.interviewId+'/start'}>
         <Button className='cursor-pointer'>Start Interview</Button>
       </Link>
       </div>
       </div>
  )
}

export default interview