"use client"
import { eq } from 'drizzle-orm';
import React, { useEffect , useState} from 'react';
import { use } from 'react'
import { db } from '../../../../../utils/db';
import { MockInterview } from '../../../../../utils/schema';
import QuestionSection from './_components/QuestionSection'
import dynamic from 'next/dynamic';
import { Button } from '../../../../../components/ui/button';
import Link  from "next/link";  

const RecordAnswerSection = dynamic(
  () => import('./_components/RecordAnswerSection'),
  { ssr: false }
);


function StartInterview({params}) {
  const param= use(params);
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion]= useState([])
  const [activeQuestionIndex,setActiveQuestionIndex] = useState(0);

  useEffect(()=>{
    GetInterviewDetails()
  },[])

  const GetInterviewDetails=async()=>{
    const result = await db.select().from(MockInterview)
    .where(eq(MockInterview.mockId, param.interviewId))
    
    const jsonMockResp= JSON.parse(result[0].jsonMockResp)
    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]);
    
  }
  return (
    <div>
    <div className="grid grid-cols-1 md:grid-cols-2 my-10 gap-10">
        {/* Questin Section */}
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video/audio Recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className='flex justify-end gap-5'>
        {activeQuestionIndex>0 &&
        <Button onClick={() => setActiveQuestionIndex(i => i - 1)}>Previous Question</Button>}
        {activeQuestionIndex!==mockInterviewQuestion?.length-1&& 
        <Button onClick={() => setActiveQuestionIndex(i => i + 1)}>Next Question</Button>}
        {activeQuestionIndex==mockInterviewQuestion?.length-1&&
        <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
        <Button>End Interview</Button>
        </Link>}
      </div>

      </div>
  )
}

export default StartInterview