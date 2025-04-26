// app/hooks/useSpeechRecognition.js
import { useEffect, useRef, useState } from "react";

const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState([]);
  const [interimResult, setInterimResult] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcriptList = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          transcriptList.push({ transcript, timestamp: Date.now() });
        } else {
          setInterimResult(transcript);
        }
      }
      if (transcriptList.length > 0) {
        setResults((prev) => [...prev, ...transcriptList]);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setResults([]);
      setInterimResult('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    results,
    interimResult,
    error,
    startListening,
    stopListening,
  };
};

export default useSpeechRecognition;

