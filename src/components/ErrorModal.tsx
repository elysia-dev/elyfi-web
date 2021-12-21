import { utils } from 'ethers';
import { FunctionComponent, useContext, useRef } from 'react';
import TxContext from 'src/contexts/TxContext';
import TxStatus from 'src/enums/TxStatus';
import ethersJsErrors from 'src/utiles/ethersJsErrors';

type Props = {
  error: string;
};

const ErrorModal: FunctionComponent<Props> = ({ error }) => {
  const errorDescription = useRef<HTMLTextAreaElement>(null);
  const totalHeight = document.documentElement.scrollHeight;
  const { initTransaction } = useContext(TxContext);
  const errorCopy = () => {
    errorDescription.current?.select();
    document.execCommand('copy');
  };

  const onCloseHandler = () => {
    initTransaction(TxStatus.IDLE, false);
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          height: totalHeight,
          background: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9997,
        }}
      />
      <div
        style={{
          border: '1px solid #ffffff',
          width: 300,
          height: 300,
          background: '#ffffff',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 9999,
          padding: 20,
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <div>트랜잭션 실패</div>
          <div className="close-button" onClick={() => onCloseHandler()}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div
          style={{
            marginBottom: 30,
          }}>
          {ethersJsErrors.includes(error)
            ? ' 요청하신 트랜잭션이 실패했습니다. 아래 에러 코드/메시지를 복사하여 cs@elysia.land로 문의주세요'
            : '메타마스크에서 발생한 에러로 인해 요청하신 트랜잭션이실패했습니다. \n 아래 에러 코드/메시지를 복사하여 cs@elysia.land로 문의주세요'}
        </div>
        <div
          style={{
            marginBottom: 10,
          }}>
          에러 코드메시지
        </div>
        <div
          style={{
            display: 'flex',
          }}>
          <div>
            <textarea
              ref={errorDescription}
              readOnly
              value={error}
              style={{
                resize: 'none',
              }}>
              {error}
            </textarea>
          </div>
          <div
            style={{
              cursor: 'pointer',
              padding: 10,
              border: '1px solid #000000',
              marginLeft: 10,
            }}
            onClick={() => errorCopy()}>
            복사
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorModal;
