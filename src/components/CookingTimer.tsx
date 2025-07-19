
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Timer } from 'lucide-react';

interface CookingTimerProps {
  duration: number;
  stepIndex: number;
  onComplete: () => void;
  disabled: boolean;
}

const CookingTimer: React.FC<CookingTimerProps> = ({ 
  duration, 
  stepIndex, 
  onComplete,
  disabled 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer: number;
    
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            setIsCompleted(true);
            onComplete();
            toast.success(`Timer for step ${stepIndex + 1} completed!`);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, onComplete, stepIndex]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsCompleted(false);
  };

  return (
    <div className="modern-timer-container">
      <div className="modern-timer-display">
        <Timer className="w-8 h-8 text-purple-500 mb-2" />
        <span className="time-text">{formatTime(timeLeft)}</span>
      </div>
      <div className="timer-controls">
        {!isRunning && timeLeft === duration && !disabled && (
          <Button 
            onClick={handleStart} 
            className="timer-button gradient-purple"
            size="lg"
          >
            Start Timer
          </Button>
        )}
        
        {isRunning && (
          <Button 
            onClick={handlePause} 
            className="timer-button gradient-orange"
            size="lg"
          >
            Pause
          </Button>
        )}
        
        {!isRunning && timeLeft < duration && timeLeft > 0 && (
          <Button 
            onClick={handleStart} 
            className="timer-button gradient-blue"
            size="lg"
          >
            Resume
          </Button>
        )}
        
        {((!isRunning && timeLeft < duration) || isCompleted) && (
          <Button 
            onClick={handleReset} 
            className="timer-button gradient-gray"
            size="lg"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default CookingTimer;
