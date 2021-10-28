import ReactGA from 'react-ga';

const useTxTracking = () => {
  const initTracker = (category: string, action: string, label: string) => {
    return {
      clicked: () => {
        ReactGA.event({
          category,
          action: `Click ${action}`,
          label,
        });
      },
      created: () => {
        ReactGA.event({
          category,
          action: `${action} tx is created`,
          label,
        });
      },
      canceled: () => {
        ReactGA.event({
          category,
          action: `${action} tx is canceled`,
          label,
        });
      },
    };
  };

  return initTracker;
};

export default useTxTracking;
