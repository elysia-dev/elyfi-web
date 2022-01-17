import MediaQuery from 'src/enums/MediaQuery';
import { useMediaQuery } from 'react-responsive';
import { useEffect } from 'react';

const useMediaQueryType = (): { value: MediaQuery } => {
  const isPc = useMediaQuery({
    query: '(min-width: 1190px)',
  });
  const isTablet = false;
  // useMediaQuery({
  //   // query: '(min-width: 768px) and (max-width: 1189px)',
  // });
  const isMobile = useMediaQuery({
    query: '(max-width: 1189px)',
  });

  const setMediaQuery = () => {
    isPc
      ? window.sessionStorage.setItem('@MediaQuery', 'PC')
      : isTablet
      ? window.sessionStorage.setItem('@MediaQuery', 'Tablet')
      : window.sessionStorage.setItem('@MediaQuery', 'Mobile');
  };
  useEffect(() => {
    setMediaQuery();
  }, [isPc, isTablet, isMobile]);

  return {
    value: isPc
      ? MediaQuery.PC
      : isTablet
      ? MediaQuery.Tablet
      : MediaQuery.Mobile,
  };
};

export default useMediaQueryType;
