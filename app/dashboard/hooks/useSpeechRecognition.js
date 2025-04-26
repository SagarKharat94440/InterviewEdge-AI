import { useState, useEffect } from 'react';

const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState([]);
  const [interimResult, setInterimResult] = useState('');
  const [error, setError] = useState(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if the browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      console.log("Speech Recognition available:", !!SpeechRecognition);
      
      if (!SpeechRecognition) {
        console.error("Speech Recognition is not available in this browser");
        setError('Speech recognition is not supported by your browser');
        return;
      }

      try {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
          console.log('Speech recognition started');
          setIsRecording(true);
        };

        recognitionInstance.onend = () => {
          console.log('Speech recognition ended');
          setIsRecording(false);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setError(event.error);
          setIsRecording(false);
        };

        recognitionInstance.onresult = (event) => {
          console.log("Speech result event:", event);
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            console.log(`Transcript ${i}:`, transcript, "isFinal:", event.results[i].isFinal);
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          console.log("Final transcript:", finalTranscript);
          console.log("Interim transcript:", interimTranscript);

          if (finalTranscript) {
            setResults(prev => {
              const newResults = [...prev, {
                transcript: finalTranscript,
                timestamp: new Date().toISOString()
              }];
              console.log("Updated results:", newResults);
              return newResults;
            });
          }
          
          setInterimResult(interimTranscript);
        };

        console.log("Recognition instance created successfully");
        setRecognition(recognitionInstance);
      } catch (err) {
        console.error("Error creating speech recognition instance:", err);
        setError("Failed to initialize speech recognition: " + err.message);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
    };
  }, []);

  const startListening = () => {
    console.log("Starting listening with recognition:", !!recognition);
    if (recognition) {
      try {
        recognition.start();
        setResults([]);
        setInterimResult('');
        setError(null);
        console.log("Speech recognition started successfully");
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError('Error starting speech recognition: ' + error.message);
      }
    } else {
      console.error("Cannot start - recognition object is null");
      setError("Speech recognition not initialized");
    }
  };

  const stopListening = () => {
    console.log("Stopping listening with recognition:", !!recognition);
    if (recognition) {
      try {
        recognition.stop();
        console.log("Speech recognition stopped successfully");
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return {
    isRecording,
    results,
    interimResult,
    error,
    startListening,
    stopListening,
    clearResults 
  };
};

export default useSpeechRecognition; 