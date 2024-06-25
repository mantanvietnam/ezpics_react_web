import { useState, useEffect } from 'react';

const useCheckInternet = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkInternet = async () => {
      try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkInternet();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export default useCheckInternet;
