import { BigNumber } from 'ethers';
import { FunctionComponent, useContext } from 'react';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import { formatCommaSmall, formatSixFracionDigit } from 'src/utiles/formatters';
import { formatEther } from 'ethers/lib/utils';
import useTxTracking from 'src/hooks/useTxTracking';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import ReservesContext from 'src/contexts/ReservesContext';
import { IncentivePool__factory } from '@elysia-dev/contract-typechain';
import CountUp from 'react-countup';
import ModalHeader from 'src/components/ModalHeader';
import { Web3Context } from 'src/providers/Web3Provider';

// Create deposit & withdraw
const IncentiveModal: FunctionComponent<{
  balanceBefore: BigNumber;
  balanceAfter: BigNumber;
  visible: boolean;
  incentivePoolAddress: string;
  onClose: () => void;
  afterTx: () => Promise<void>;
  transactionModal: () => void;
}> = ({
  visible,
  balanceBefore,
  balanceAfter,
  incentivePoolAddress,
  onClose,
  afterTx,
  transactionModal,
}) => {
  const { account, provider } = useContext(Web3Context);
  const initTxTracker = useTxTracking();
  const { reserves } = useContext(ReservesContext);
  const { setTransaction, failTransaction } = useContext(TxContext);

  const reqeustClaimIncentive = async () => {
    if (!account || !provider) return;

    const tracker = initTxTracker(
      'IncentiveModal',
      'Claim',
      `${formatEther(balanceAfter)} ${reserves[0].incentivePool.id}`,
    );

    tracker.clicked();

    IncentivePool__factory.connect(incentivePoolAddress, provider.getSigner())
      .claimIncentive()
      .then((tx) => {
        tracker.created();
        setTransaction(
          tx,
          tracker,
          RecentActivityType.Claim,
          () => {
            transactionModal();
            onClose();
          },
          () => {
            afterTx();
          },
        );
      })
      .catch((error) => {
        failTransaction(tracker, onClose, error);
        console.error(error);
      });
  };

  return (
    <div
      className="modal modal__incentive"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          title={"ELFI"}
          image={ElifyTokenImage}
          onClose={onClose}
        />
        <div className="modal__body">
          <div
            className="modal__incentive__body"
            style={{
              height: 140,
              overflowY: 'clip',
            }}>
            <CountUp
              className="modal__incentive__value bold"
              start={parseFloat(formatEther(balanceBefore))}
              end={parseFloat(formatEther(balanceAfter))}
              formattingFn={(number) => {
                return formatSixFracionDigit(number);
              }}
              decimals={6}
              duration={1}
            />
          </div>
          <div
            className="modal__button"
            onClick={() => {
              reqeustClaimIncentive();
            }}>
            <p>CLAIM REWARD</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncentiveModal;
