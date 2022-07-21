import moment from 'moment';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { formatCommaSmallZeroDisits, toCompact } from 'src/utiles/formatters';
import Arrow from 'src/assets/images/market/arrow.svg';

interface Props {
  userTotalPurchase?: number;
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

  useLayoutEffect(() => {
    if (current.isAfter(endedTime)) {
      setRemainingTime({ day: 0, hour: 0, minute: 0, second: 0 });
      return;
    }
    if (current.isBefore(startTime)) {
      setRemainingTime({ day: 14, hour: 0, minute: 0, second: 0 });
      return;
    }
    const getTime = moment.duration(endedTime.diff(current));
    setRemainingTime({
      day: getTime.days(),
      hour: getTime.hours(),
      minute: getTime.minutes(),
      second: getTime.seconds(),
    });
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (current.isAfter(endedTime)) {
        return;
      }
      if (current.isBefore(startTime)) {
        return;
      }
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
        <h2>
          {t('nftMarket.currentPurchase')}
          <a
            href="https://etherscan.io/"
            target="_blank"
            style={{
              cursor: 'pointer',
              marginLeft: 5,
            }}>
            <img src={Arrow} alt={'Arrow'} />
          </a>
        </h2>
        <div>
          <div>
            <p>{t('nftMarket.purchasedNTF')}</p>
            <p>{t('nftMarket.totalPurchased')}</p>
          </div>
          <div>
            <b>
              {userTotalPurchase || userTotalPurchase === 0 ? (
                formatCommaSmallZeroDisits(userTotalPurchase)
              ) : (
                <Skeleton width={60} height={15} />
              )}
            </b>
            <b>{formatCommaSmallZeroDisits(totalPurchase)}</b>
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
          {moment(startTime).format('YYYY.MM.DD HH:mm:ss')} ~{' '}
          {moment(endedTime).format('YYYY.MM.DD HH:mm:ss')} KST
        </p>
      </section>
    </>
  );
};

export default Purchase;
