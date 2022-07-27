import moment from 'moment';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import Arrow from 'src/assets/images/market/arrow.svg';
import { formatCommaSmallZeroDisits } from 'src/utiles/formatters';

interface Props {
  userTotalPurchase?: number;
  totalPurchase: number;
  startTime: moment.Moment;
  endedTime: moment.Moment;
  etherscanLink: string;
  offChainSellingAmount: number;
  totalAmount: number;
  usdcPerNft: number;
}

const Purchase: React.FC<Props> = ({
  userTotalPurchase,
  totalPurchase,
  startTime,
  endedTime,
  etherscanLink,
  offChainSellingAmount,
  totalAmount,
  usdcPerNft,
}) => {
  const { t } = useTranslation();
  const current = moment();
  const [remainingTime, setRemainingTime] = useState({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  });
  const [unfoldProgress, setProgress] = useState(false);

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
        <section className="nft-details__purchase__header">
          <h2>{t('nftMarket.currentPurchase')}</h2>
          <a href={etherscanLink} target="_blank">
            <img src={Arrow} alt="new tab icon" />
          </a>
        </section>
        <div>
          <div>
            <p>{t('nftMarket.purchasedNTF')}</p>
            <p>{t('nftMarket.totalPurchased')}</p>
          </div>
          <div>
            <b>
              {userTotalPurchase ? (
                formatCommaSmallZeroDisits(
                  offChainSellingAmount + userTotalPurchase * usdcPerNft,
                )
              ) : (
                <Skeleton width={100} height={20} />
              )}
            </b>
            <b>
              {userTotalPurchase ? (
                formatCommaSmallZeroDisits(totalAmount)
              ) : (
                <Skeleton width={100} height={20} />
              )}
            </b>
          </div>
          {userTotalPurchase ? (
            <progress
              value={
                offChainSellingAmount + (userTotalPurchase || 0) * usdcPerNft
              }
              max={totalAmount}
            />
          ) : (
            <Skeleton width={530} height={10} style={{ marginTop: 10 }} />
          )}
        </div>
        <section
          className="nft-details__purchase__progress-section"
          style={{
            height: unfoldProgress ? 370 : 0,
            paddingBottom: unfoldProgress ? 18 : 0,
          }}>
          {userTotalPurchase ? (
            <>
              <section>
                <b>1. 오프체인 백커</b>
                <div>
                  <div>
                    <p>판매 USD</p>
                    <p>총 USD</p>
                  </div>
                  <div>
                    <b>{formatCommaSmallZeroDisits(offChainSellingAmount)}</b>
                    <b>{formatCommaSmallZeroDisits(offChainSellingAmount)}</b>
                  </div>
                  <progress
                    value={offChainSellingAmount}
                    max={offChainSellingAmount}
                  />
                </div>
              </section>
              <section>
                <b>2. 온체인 판매 현황</b>
                <div>
                  <div>
                    <p>판매 NFT</p>
                    <p>총 NFT</p>
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
                </div>
              </section>
            </>
          ) : (
            <Skeleton width={530} height={370} />
          )}
          <span>(* 1NFT = $10)</span>
        </section>
        <section
          className="nft-details__purchase__footer"
          onClick={() => setProgress(!unfoldProgress)}>
          <span
            className="nft-details__purchase__arrow"
            style={{
              transform: unfoldProgress ? 'rotate(-45deg)' : 'rotate(135deg)',
              marginBottom: unfoldProgress ? -4 : 9,
            }}
          />
        </section>
      </section>

      <section className="nft-details__purchase__round">
        <section className="nft-details__purchase__header">
          <h2>{t('nftMarket.purchasedDate')}</h2>
        </section>
        <div>
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
        </div>

        <section className="nft-details__purchase__footer">
          <p>
            {moment(startTime).format('YYYY.MM.DD HH:mm:ss')} ~{' '}
            {moment(endedTime).format('YYYY.MM.DD HH:mm:ss')} KST
          </p>
        </section>
      </section>
    </>
  );
};

export default Purchase;
