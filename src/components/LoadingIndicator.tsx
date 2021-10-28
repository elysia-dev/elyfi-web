const LoadingIndicator: React.FunctionComponent = () => {
  return (
    <div className="loading-indicator">
      <div className="loader">
        <div className="l_main">
          <div className="l_square">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="l_square">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="l_square">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="l_square">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className="loading-indicator__text">
        <p className="bold">Transaction is now loading</p>
      </div>
      <div className="loading-indicator__text2">
        <p className="spoqa">
          this pop-up window will close in about 15-30 seconds.
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
