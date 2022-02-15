import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { FunctionComponent, useContext } from 'react';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import { formatCommaSmall, formatSixFracionDigit } from 'src/utiles/formatters';
import { formatEther } from 'ethers/lib/utils';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import { IncentivePool__factory } from '@elysia-dev/contract-typechain';
import CountUp from 'react-countup';
import ModalHeader from 'src/components/ModalHeader';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import ReserveData from 'src/core/data/reserves';
import ModalViewType from 'src/enums/ModalViewType';
import TransactionType from 'src/enums/TransactionType';
import ElyfiVersions from 'src/enums/ElyfiVersions';

// Create deposit & withdraw
const IncentiveModal: FunctionComponent<{
  balanceBefore: BigNumber;
  balanceAfter: BigNumber;
  visible: boolean;
  incentivePoolAddress: string;
  tokenName: string;
  onClose: () => void;
  afterTx: () => void;
  transactionModal: () => void;
}> = ({
  visible,
  balanceBefore,
  balanceAfter,
  incentivePoolAddress,
  tokenName,
  onClose,
  afterTx,
  transactionModal,
}) => {
  const { account, library, chainId } = useWeb3React();
  const { setTransaction, failTransaction } = useContext(TxContext);

  const reqeustClaimIncentive = async () => {
    if (!account || !library) return;

    const emitter = buildEventEmitter(
      ModalViewType.IncentiveModal,
      TransactionType.Claim,
      JSON.stringify({
        version: ElyfiVersions.V1,
        chainId,
        address: account,
        moneypoolType: tokenName,
        incentiveAmount: utils.formatEther(balanceAfter),
      }),
    );

    emitter.clicked();
    IncentivePool__factory.connect(incentivePoolAddress, library.getSigner())
      .claimIncentive()
      .then((tx) => {
        emitter.created();
        setTransaction(
          tx,
          emitter,
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
        failTransaction(emitter, onClose, error);
        console.error(error);
      });
  };

  return (
    <div
      className="modal modal__incentive"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader title={'ELFI'} image={ElifyTokenImage} onClose={onClose} />
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
