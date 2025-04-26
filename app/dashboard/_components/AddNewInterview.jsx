"use client";
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import {getAIResponse} from '../../../utils/GeminiAIModel'
import {db} from '../../../utils/db'
import { MockInterview } from '../../../utils/schema';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '../../../components/ui/dialog';
import {  LoaderCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';
  
function AddNewInterview() {
  const [openDialog, setOpenDialog] =useState(false)
  const [jobPostion, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [ loading, setLoading]= useState(false);
  const { user } = useUser();
  const [ jsonResponse, setJsonResponse]= useState([]);
  const router=useRouter();

  const onSubmit=async(e)=>{
    setLoading(true);
    e.preventDefault();
    
    const count = process.env.NEXT_PUBLIC_QUESTION_COUNT || 5;
    const input = `Job Position: ${jobPostion}
     Job Description: ${jobDesc}
    Years of Experience: ${jobExperience}

    Based on this information, provide ${count} interview questions with answers in **JSON format**.
     Each item should be an object with "Question" and "Answer" fields.`;

     const result = await getAIResponse(input);
     const MockResponse=result
     .replace("```json", "")
     .replace("```", "")
     .trim();
     console.log("Final response:", JSON.parse(MockResponse));
     setLoading(false);
     setJsonResponse(MockResponse);
     
     if(MockResponse)
     {
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockResponse,
        jobPosition: jobPostion,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DD"),
      }).returning({ mockId: MockInterview.mockId });
      
      console.log("Inserted Id", resp);
      if(resp){
        setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId);
      }
    }
    else{
      console.log("Error")
    }
  }
  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary
      hover:scale-105 hover:shadow-md cursor-pointer transition-all'
      onClick={()=>{setOpenDialog(true)}}>
        <h2>+ Add New</h2>
      </div>
    <Dialog open={openDialog} onOpenChange={setOpenDialog} >
      
      <DialogContent className="max-w-2xl ">
        <DialogHeader>
          <DialogTitle className="text-2xl">Tell us more about your job</DialogTitle>
          <DialogDescription className="text-lg font-semibold">
             Add Details about your job position/role, Job description and Years of experience
           </DialogDescription>

            <form onSubmit={onSubmit}>
            <div>
            
              <div  className='mt-7 my-3'>
                <label>Job Role / Job Position</label>
                <Input placeholder="Ex. Full Stack Developer" required 
                onChange={(event)=>setJobPosition(event.target.value)}/>
              </div>
              <div  className='mt-7 my-3'>
                <label>Job Description / Tech Stack (In Short)</label>
                <Textarea placeholder="Ex. React, Angular, NodeJs" required
                 onChange={(event)=>setJobDesc(event.target.value)}/>
              </div>
              <div  className='mt-7 my-3'>
                <label>Years of experience</label>
                <Input placeholder="Ex. 5" type="number" min="0" max="50" required
                 onChange={(event)=>setJobExperience(event.target.value)}/>
              </div>
            </div>
            <div className="flex gap-5 justify-end">
             <Button
             type="button"
             variant="ghost"
              onClick={() => setOpenDialog(false)}
              className="cursor-pointer"
             >
             Cancel
             </Button>
             <Button type="submit" className="cursor-pointer"
             disabled={loading}>
              {loading?(
                      <>
                        <LoaderCircle className="animate-spin" />
                        Generating From AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
             
             </Button>
            </div>

            </form>
          
        </DialogHeader>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default AddNewInterview