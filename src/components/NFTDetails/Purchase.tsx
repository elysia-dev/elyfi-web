import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  userTotalPurchase: number;
  totalPurchase: number;
  startTime: moment.Moment;
  endedTime: moment.Moment;
}

const Purchase: React.FC<Props> = ({
  userTotalPurchase,
  totalPurchase,
  startTime,
  endedTime,
}) => {
  const { t } = useTranslation();
  const current = moment();
  const [remainingTime, setRemainingTime] = useState({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  });

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
      <section className="nft-details__purchase__status">
        <h2>{t('nftMarket.currentPurchase')}</h2>
        <div>
          <div>
            <p>{t('nftMarket.purchasedNTF')}</p>
            <p>{t('nftMarket.totalPurchased')}</p>
          </div>
          <div>
            <b>{userTotalPurchase}</b>
            <b>{totalPurchase}</b>
          </div>
          <progress value={userTotalPurchase} max={totalPurchase} />
          <p>(* 1NFT = $10)</p>
        </div>
      </section>
      <section className="nft-details__purchase__round">
        <h2>{t('nftMarket.purchasedDate')}</h2>
        <div>
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
        </div>
        <p>
          {moment(startTime).format('YYYY.MM.DD')} ~{' '}
          {moment(endedTime).format('YYYY.MM.DD')} KST
        </p>
      </section>
    </>
  );
};

export default Purchase;
