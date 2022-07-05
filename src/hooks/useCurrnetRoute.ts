import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export enum NavigationRoutes {
  Deposit,
  Governance,
  Staking,
  Faq = 4,
}

interface RouteState {
  route: string | undefined;
}

const useCurrentRoute = (): NavigationRoutes | undefined => {
  const location = useLocation();
  // const { state } = useLocation<RouteState>();

  const getCurrentRoute = () => {
    switch (location.pathname.split('/')[2]) {
      case 'deposit':
        return NavigationRoutes.Deposit;
      case 'governance':
        return NavigationRoutes.Governance;
      case 'staking':
        return NavigationRoutes.Staking;
      case 'faq':
        return NavigationRoutes.Faq;
      case 'rewardplan':
        switch (location.pathname.split('/')[3]) {
          case 'deposit':
            return NavigationRoutes.Deposit;
          case 'EL':
          case 'ELFI':
          case 'LP':
            return NavigationRoutes.Staking;
          default:
          // No Default
        }
        break;
      case 'portfolio':
        return location.state === 'governance'
          ? NavigationRoutes.Governance
          : NavigationRoutes.Deposit;
      default:
        return undefined;
    }
  };

  const currnetRoute = useMemo(() => getCurrentRoute(), [location]);

  return currnetRoute;
};

export default useCurrentRoute;
