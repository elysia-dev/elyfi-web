import { useTranslation } from 'react-i18next';
import SpinnerToken from 'src/assets/images/market/tokenSpinning.mp4';
import Logo from 'src/assets/images/ELYFI_logo.svg';
import moment from 'moment';

interface Props {
  tokenName: string;
  tokenAmount: number;
  endedTime: moment.Moment;
  onClose: () => void;
}

const TokenRewardModal: React.FC<Props> = ({
  tokenName,
  tokenAmount,
  endedTime,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="market_modal" style={{ display: 'block' }}>
        <div className="market_modal__wrapper">
          <header className={`market_modal__header `}>
            <img
              src={Logo}
              alt="Elyfi logo"
              style={{ width: 120, height: 28 }}
            />
            <div onClick={onClose}>
              <div></div>
              <div></div>
            </div>
          </header>
          <div className="market_modal__token-reward">
            <b>
              축하합니다!
              <br />
              {tokenName} 토큰 {tokenAmount.toFixed(4)}개를 받았습니다.
            </b>
            <video
              src={SpinnerToken}
              muted={true}
              loop={true}
              autoPlay={true}
            />
            <section>
              <p>{tokenName} 토큰 지급일</p>
              <b>{moment(endedTime).format('YYYY.MM.DD')} KST</b>
              <p>* 토큰 지급 완료 시점까지 트위터 게시물이 유지돼야 합니다</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenRewardModal;
