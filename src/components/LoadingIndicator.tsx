
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
        <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
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
