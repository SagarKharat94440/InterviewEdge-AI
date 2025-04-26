"use client";
import Webcam from "react-webcam";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../../../../../../components/ui/button";
import useSpeechRecognition from "../../../../../hooks/useSpeechRecognition";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import {getAIResponse } from '../../../../../../utils/GeminiAIModel'
import { db } from "../../../../../../utils/db";
import { UserAnswer } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({activeQuestionIndex,mockInterviewQuestion,interviewData}) {
  const { user}= useUser();
  const [debugInfo, setDebugInfo] = useState({ supported: false, checked: false });
  const [userAnswer, setuserAnswer]= useState('');
  const [loading, setLoading]= useState(false);

  const {
    isRecording,
    results,
    interimResult,
    error,
    clearResults,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  useEffect(() => {
    // Check browser support on client side
    if (typeof window !== 'undefined') {
      const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
      setDebugInfo({
        supported,
        checked: true,
        userAgent: navigator.userAgent
      });
    }
  }, []);

  useEffect(() => {
   
    results.map((result)=>{
      setuserAnswer(prevAns=>prevAns+result?.transcript);
    })
    
    console.log("Results:", results);
  }, [ results]);

  useEffect(() => {
    if (!isRecording && !loading) {
      // This will ensure results are cleared when needed
      setuserAnswer('');
    }
  }, [isRecording, loading]);

  const SaveUserAnswer=async()=>{
    if(isRecording){
      setLoading(true);
      stopListening();
      if(userAnswer?.length<10){
        setLoading(false);
        toast('Error while saving your answer, Please record again')
        return;
      }
      const feedbackPrompt = `
     Return ONLY valid minified JSON like:
     {"rating":8,"feedback":"Good depth but improve conciseness."}

     Question: ${mockInterviewQuestion[activeQuestionIndex]?.Question}
     User Answer: ${userAnswer}

     Based on the question and the answer, respond with:
     • "rating"  – an integer from 0‑10  
     • "feedback" – 3‑5 concise lines describing areas for improvement

     Return exactly one line of JSON, nothing else.
    `;

      const result = await getAIResponse(feedbackPrompt)
      const MockResponse=result
      .replace("json", "")
      .replace("", "")
      .trim();
      console.log(MockResponse)
      const jsonfeedbackResp=JSON.parse(MockResponse);


      const resp=await db.insert(UserAnswer)
      .values({
        mockIdRef:interviewData?.mockId,
        question:mockInterviewQuestion[activeQuestionIndex]?.Question,
        correctAns:mockInterviewQuestion[activeQuestionIndex]?.Answer,
        userAns: userAnswer,
        feedback: jsonfeedbackResp?.feedback,
        rating: jsonfeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      })
        
      if(resp){
        toast('User Answer recorded successFully');
        setuserAnswer('');
        
      }
      setLoading(false);

    }else{
      startListening();
    }
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src="/camera.jpg"
          alt="Camera control"
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      <Button
        disabled={loading}
        className="my-10"
         onClick={ SaveUserAnswer}
          >
         {isRecording ? 
         <h2 className="text-red-600 flex gap-2">
            <Mic/> Stop Recording
         </h2>: 'Record Answer'}
       </Button>
    </div>
  );
}

export default RecordAnswerSection;