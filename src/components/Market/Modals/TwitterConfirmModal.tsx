import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from 'src/assets/images/ELYFI_logo.svg';
import Twitter from 'src/assets/images/market/twitter.mp4';
import ModalButton from 'src/components/Modal/ModalButton';

interface Props {
  endedTime: moment.Moment;
  onClose: () => void;
  onSubmit: () => void;
  onDiscard: () => void;
}

const TwitterConfirmModal: React.FC<Props> = ({
  endedTime,
  onClose,
  onSubmit,
  onDiscard,
}) => {
  const [remainingTime, setRemainingTime] = useState({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  });
  const { t } = useTranslation();
  const current = moment();

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const getTime = moment.duration(endedTime.diff(current));
      setRemainingTime({
        day: getTime.days(),
        hour: getTime.hours(),
        minute: getTime.minutes(),
        second: getTime.seconds(),
      });
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  });

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
          <section className="market_modal__twitter">
            <figure>
              <video src={Twitter} muted={true} loop={true} autoPlay={true} />
              <figcaption>
                <b>
                  리트윗하고
                  <br />
                  1% 페이백을 받아보세요!
                </b>
              </figcaption>
            </figure>
            <section>
              <div>
                <b>{remainingTime.day.toString().padStart(2, '0')}</b>
                <p>{t('nftMarket.timeUnit.0')}</p>
              </div>
              <b>:</b>
              <div>
                <b>{remainingTime.hour.toString().padStart(2, '0')}</b>
                <p>{t('nftMarket.timeUnit.1')}</p>
              </div>
              <b>:</b>
              <div>
                <b>{remainingTime.minute.toString().padStart(2, '0')}</b>
                <p>{t('nftMarket.timeUnit.2')}</p>
              </div>
              <b>:</b>
              <div>
                <b>{remainingTime.second.toString().padStart(2, '0')}</b>
                <p>{t('nftMarket.timeUnit.3')}</p>
              </div>
            </section>
          </section>
          <ModalButton
            content="리트윗하고 1% 더 페이백 받기"
            onClick={onSubmit}
          />
          <article className="market_modal__visible">
            <div onClick={onDiscard} />
            <b>혜택 포기하고, 다시보지 않기</b>
          </article>
        </div>
      </div>
    </>
  );
};

export default TwitterConfirmModal;
