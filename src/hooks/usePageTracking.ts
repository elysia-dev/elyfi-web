import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

const usePageTracking = (): void => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GA_ID || '', {
      debug: process.env.NODE_ENV === 'development',
    });
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);
};

export default usePageTracking;
