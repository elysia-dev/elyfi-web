import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useNavigator = (): ((pathName: any) => void) => {
  const navigate = useNavigate();

  const setPath = useCallback((pathName: any) => {
    navigate(pathName);
  }, []);

  return setPath;
};

export default useNavigator;
