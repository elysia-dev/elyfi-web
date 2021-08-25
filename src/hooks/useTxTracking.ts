import ReactGA from "react-ga";

const useTxTracking = () => {
  const initTracker = (category: string, action: string, label: string) => {
    return {
      clicked: () => {
        ReactGA.event({
          category: category,
          action: `Click ${action}`,
          label: label,
        })
      },
      created: () => {
        ReactGA.event({
          category: category,
          action: `${action} tx is created`,
          label: label,
        })
      },
      canceled: () => {
        ReactGA.event({
          category: category,
          action: `${action} tx is canceled`,
          label: label,
        })
      }
    }
  }

  return initTracker;
};

export default useTxTracking;