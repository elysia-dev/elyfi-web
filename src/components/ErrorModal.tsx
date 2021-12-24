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
          width: 500,
          height: 445.5,
          borderRadius: 10,
          background: '#ffffff',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 9999,
          paddingBottom: 31,
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '29.25px 31px 20.25px 28px ',
          }}>
          <div
            className="bold"
            style={{
              fontSize: 18,
              color: '#333333',
            }}>
            트랜잭션 실패
          </div>
          <div className="close-button" onClick={() => onCloseHandler()}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <hr />
        <div
          style={{
            padding: '33.25px 37.25px 30.75px 38.75px',
            fontSize: 15,
          }}>
          {ethersJsErrors.includes(error)
            ? ' 요청하신 트랜잭션이 실패했습니다. 아래 에러 코드/메시지를 복사하여 cs@elysia.land로 문의주세요.'
            : '메타마스크에서 발생한 에러로 인해 요청하신 트랜잭션이실패했습니다. \n 아래 에러 코드/메시지를 복사하여 cs@elysia.land로 문의주세요.'}
        </div>
        <div
          style={{
            background: '#F0F0F1',
            padding: '18px 31.25px 21px 27.75px',
          }}>
          <div
            className="bold"
            style={{
              marginBottom: 10,
            }}>
            에러 코드&메시지
          </div>
          <div
            style={{
              display: 'flex',
            }}>
            <div
              style={{
                width: '100%',
              }}>
              <textarea
                ref={errorDescription}
                readOnly
                value={error}
                style={{
                  resize: 'none',
                  width: '100%',
                  height: 88,
                  textAlign: 'left',
                  padding: 20,
                  border: '1px solid #E6E6E6',
                  borderRadius: 5,
                }}></textarea>
            </div>
          </div>
        </div>
        <div
          style={{
            margin: '20px auto',
          }}
          className={`modal__button`}
          onClick={() => errorCopy()}>
          <p>복사하기</p>
        </div>
      </div>
    </>
  );
};

export default ErrorModal;
