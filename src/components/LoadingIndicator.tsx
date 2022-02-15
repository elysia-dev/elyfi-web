
import Coin from 'src/assets/images/ELFI.png';
import ModalButton from 'src/components/ModalButton';

const LoadingIndicator: React.FunctionComponent<{
  button?: string;
}> = ({
  button
}) => {
  return ( 
    <>
      <div className="indicator">
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img src={Coin} style={{ width: 300, height: 300 }} />
            </div>
            <div className="flip-card-thick"></div>
            <div className="flip-card-back">
              <h2>
                ELYFI
              </h2>
            </div>
          </div>
        </div>
      </div>
      <ModalButton
        className='modal__button disable'
        onClick={() => { }}
        content={button || ""}
      />
    </>
  );
};

export default LoadingIndicator;
