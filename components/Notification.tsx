
import React, { useState, useEffect } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
}

const typeClasses = {
  success: 'bg-green-100 border-green-500 text-green-700',
  error: 'bg-red-100 border-red-500 text-red-700',
  info: 'bg-blue-100 border-blue-500 text-blue-700',
};

const iconPaths = {
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // This allows for the entrance animation
    setVisible(true);
  }, []);

  return (
    <div
      aria-live="assertive"
      className="fixed top-5 right-5 z-[100]"
    >
      <div
        role="alert"
        className={`relative flex items-center p-4 pr-10 border-l-4 rounded-md shadow-lg transition-all duration-500 transform ${typeClasses[type]} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
      >
        <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPaths[type]}></path>
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;
