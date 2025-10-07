import { useState, useEffect } from 'react';

const HackathonTimer = () => {
  // Set hackathon duration: October 7, 2025 9:30 AM to October 8, 2025 9:30 AM
  const hackathonStart = new Date('2025-10-07T10:09:00').getTime();
  const hackathonEnd = new Date('2025-10-08T10:09:00').getTime();
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [hackathonStatus, setHackathonStatus] = useState('upcoming');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);

  // Event timeline data
  const eventTimeline = [
    // Day 1 - October 7, 2025
    { time: '09:00', duration: '30 mins', title: 'Inaugural Ceremony', location: 'AV Hall, Central Library', day: 1, type: 'ceremony' },
    { time: '09:30', duration: '24 hours', title: 'Sprintathon Begins', location: 'Hackathon Centre', day: 1, type: 'start' },
    { time: '10:00', duration: '30 mins', title: 'Tea Break / Snacks', location: '', day: 1, type: 'break' },
    { time: '10:30', duration: '3 hours', title: 'Sprint Continues', location: '', day: 1, type: 'coding' },
    { time: '13:30', duration: '30 mins', title: 'Lunch', location: '', day: 1, type: 'break' },
    { time: '14:00', duration: '2.5 hours', title: 'First Round of Evaluation', location: '', day: 1, type: 'evaluation' },
    { time: '16:30', duration: '30 mins', title: 'Tea Break / Snacks', location: '', day: 1, type: 'break' },
    { time: '17:00', duration: '3.5 hours', title: 'Sprint Continues', location: '', day: 1, type: 'coding' },
    { time: '20:30', duration: '30 mins', title: 'Dinner', location: '', day: 1, type: 'break' },
    { time: '21:00', duration: '2 hours', title: 'Second Round of Evaluation', location: '', day: 1, type: 'evaluation' },
    { time: '23:00', duration: '2 hours', title: 'Neural Refreshment', location: '', day: 1, type: 'activity' },
    
    // Day 2 - October 8, 2025
    { time: '01:00', duration: '30 mins', title: 'Tea Break / Snacks', location: '', day: 2, type: 'break' },
    { time: '01:30', duration: '2.5 hours', title: 'Sprint Continues', location: '', day: 2, type: 'coding' },
    { time: '04:00', duration: '30 mins', title: 'Tea Break / Snacks', location: '', day: 2, type: 'break' },
    { time: '04:30', duration: '2.5 hours', title: 'Sprint Continues', location: '', day: 2, type: 'coding' },
    { time: '07:00', duration: '1 hour', title: 'Breakfast', location: '', day: 2, type: 'break' },
    { time: '09:30', duration: '0', title: 'Sprintathon Ends', location: '', day: 2, type: 'end' },
  ];

  function calculateTimeLeft() {
    const now = new Date().getTime();
    
    if (now < hackathonStart) {
      const difference = hackathonStart - now;
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        total: difference,
        status: 'upcoming'
      };
    } else if (now >= hackathonStart && now < hackathonEnd) {
      const difference = hackathonEnd - now;
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        total: difference,
        status: 'running'
      };
    } else {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
        status: 'ended'
      };
    }
  }

  function getCurrentAndNextEvents() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    let current = null;
    let next = null;

    for (let i = 0; i < eventTimeline.length; i++) {
      const event = eventTimeline[i];
      const nextEvent = eventTimeline[i + 1];
      
      if (currentTime >= event.time && (!nextEvent || currentTime < nextEvent.time)) {
        current = event;
        next = nextEvent;
        break;
      }
    }
    
    return { current, next };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      setHackathonStatus(newTimeLeft.status);
      
      if (newTimeLeft.status === 'running') {
        const { current, next } = getCurrentAndNextEvents();
        setCurrentEvent(current);
        setNextEvent(next);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const getProgress = () => {
    const now = new Date().getTime();
    const totalDuration = hackathonEnd - hackathonStart;
    
    if (now < hackathonStart) return 0;
    if (now >= hackathonEnd) return 100;
    
    const elapsed = now - hackathonStart;
    return (elapsed / totalDuration) * 100;
  };

  const getEventProgress = () => {
    if (!currentEvent || !nextEvent) return 0;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const eventStart = parseInt(currentEvent.time.split(':')[0]) * 60 + parseInt(currentEvent.time.split(':')[1]);
    const eventEnd = parseInt(nextEvent.time.split(':')[0]) * 60 + parseInt(nextEvent.time.split(':')[1]);
    
    return ((currentTime - eventStart) / (eventEnd - eventStart)) * 100;
  };

  const progress = getProgress();
  const eventProgress = getEventProgress();

  const getEventIcon = (type) => {
    switch (type) {
      case 'ceremony': return '🎤';
      case 'start': return '🚀';
      case 'coding': return '💻';
      case 'evaluation': return '📊';
      case 'break': return '☕';
      case 'activity': return '🎯';
      case 'end': return '🏁';
      default: return '⏰';
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'ceremony': return 'text-purple-400';
      case 'start': return 'text-green-400';
      case 'coding': return 'text-blue-400';
      case 'evaluation': return 'text-yellow-400';
      case 'break': return 'text-orange-400';
      case 'activity': return 'text-pink-400';
      case 'end': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Container */}
      <div className="mx-auto h-screen max-h-screen flex flex-col">
        
        {/* Header - Compact */}
      <div className="text-center mb-6">
  <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
    Sprintathon25
  </h1>
  <p className="text-gray-400 text-lg">24-Hour Hackathon • Oct 7-8, 2025</p>
</div>

        {/* Status Bar */}
        <div className="text-center mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full ${
            hackathonStatus === 'running' ? 'bg-green-500/20 border border-green-500/30' :
            hackathonStatus === 'upcoming' ? 'bg-yellow-500/20 border border-yellow-500/30' :
            'bg-red-500/20 border border-red-500/30'
          }`}>
            <span className={`text-xs font-semibold ${
              hackathonStatus === 'running' ? 'text-green-400' :
              hackathonStatus === 'upcoming' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {hackathonStatus === 'running' ? '⚡ LIVE - HACKATHON IN PROGRESS' : 
               hackathonStatus === 'upcoming' ? '🚀 STARTING SOON' : 
               '🎉 HACKATHON COMPLETED'}
            </span>
          </div>
        </div>

        {/* Current Event */}
        {currentEvent && (
          <div className="text-center mb-4">
            <div className="bg-gray-800/60 rounded-lg p-3 border border-cyan-500/30 inline-block">
              <div className="flex items-center justify-center space-x-3">
                <span className={`text-sm font-bold ${getStatusColor(currentEvent.type)}`}>
                  {getEventIcon(currentEvent.type)} {currentEvent.title}
                </span>
                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs font-mono">
                  {currentEvent.time}
                </span>
                {currentEvent.location && (
                  <span className="text-gray-400 text-xs">📍 {currentEvent.location}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
<div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 max-h-[80vh]">
  
  {/* Left Column - Timer (65-75% width) */}
  <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700/50">
    <div className="flex flex-col h-full">
      {/* Timer Section */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-8 text-center">HACKATHON TIMER</h2>
        
        {/* Timer in single line - EVEN LARGER */}
        <div className="flex justify-center items-center space-x-10 mb-10">
          {[
            { label: 'HOURS', value: timeLeft.hours + (timeLeft.days * 24) },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-gray-900/80 rounded-2xl p-8 border-2 border-cyan-500/30 min-w-[180px]">
                <div className="text-6xl md:text-7xl font-mono font-bold text-cyan-300 mb-3">
                  {formatTime(item.value)}
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-md font-bold">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bars - FULL WIDTH */}
        <div className="w-full space-y-8">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-lg text-gray-400 mb-4">
              <span className="font-bold">Overall Hackathon Progress</span>
              <span className="font-bold text-xl">{progress.toFixed(1)}%</span>
            </div>
            <div className="bg-gray-700 rounded-full h-7 w-full">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-7 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Current Event Progress */}
          {currentEvent && (
            <div>
              <div className="flex justify-between text-lg text-gray-400 mb-4">
                <span className="font-bold">Current Event Progress - {currentEvent.title}</span>
                <span className="font-bold text-xl">{eventProgress.toFixed(0)}%</span>
              </div>
              <div className="bg-gray-700 rounded-full h-5 w-full">
                <div 
                  className="bg-gradient-to-r from-green-400 to-cyan-400 h-5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(eventProgress, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Next Event */}
        {nextEvent && (
          <div className="mt-10 text-center">
            <div className="inline-flex items-center space-x-4 bg-gray-900/40 rounded-xl px-8 py-4 border border-gray-600/50">
              <span className="text-gray-400 text-lg font-bold">Next Event:</span>
              <span className="text-lg font-bold text-gray-300">
                {getEventIcon(nextEvent.type)} {nextEvent.title}
              </span>
              <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded text-md font-mono font-bold">
                {nextEvent.time}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

          {/* Right Column - Event Timeline (25-35% width) */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 overflow-hidden">
            <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center">
              <span className="mr-2">📋</span> EVENT TIMELINE
            </h3>
            
            <div className="overflow-y-auto h-full max-h-[60vh] pr-2">
              {/* Timeline with vertical line */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-600/50"></div>
                
                {/* Events */}
                <div className="space-y-2">
                  {eventTimeline.map((event, index) => (
                    <div 
                      key={index}
                      className={`flex items-start space-x-2 p-2 rounded-lg transition-all duration-200 ${
                        currentEvent?.title === event.title 
                          ? 'bg-cyan-500/20 border border-cyan-500/30' 
                          : 'bg-gray-900/30 hover:bg-gray-900/50'
                      } ${event.day === 2 ? 'border-l-2 border-green-500/50' : ''}`}
                    >
                      {/* Time indicator */}
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentEvent?.title === event.title 
                          ? 'bg-cyan-500 text-white' 
                          : event.day === 2 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {event.time.split(':')[0]}
                      </div>
                      
                      {/* Event details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-semibold ${
                            currentEvent?.title === event.title 
                              ? 'text-cyan-300' 
                              : 'text-gray-300'
                          }`}>
                            {getEventIcon(event.type)} {event.title}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {event.duration}
                          </span>
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            event.day === 1 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            D{event.day}
                          </span>
                        </div>
                        {event.location && (
                          <p className="text-xs text-gray-400 truncate">📍 {event.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="text-center mt-3 pt-3 border-t border-gray-700/30">
          <p className="text-gray-500 text-xs">
            Hackathon Period: Oct 7, 2025 9:30 AM - Oct 8, 2025 9:30 AM
          </p>
        </div>
      </div>
    </div>
  );
};

export default HackathonTimer;