import { lazy, RefObject, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import MainnetType from 'src/enums/MainnetType';
import Token from 'src/enums/Token';
import PancakeSwap from 'src/assets/images/staking/pancakeswapcake@2x.svg';
import Wormhole from 'src/assets/images/staking/wormhole@2x.svg';
import Uniswap from 'src/assets/images/staking/uniswap@2x.svg';

const TitleButton = lazy(() => import('src/components/Staking/TitleButton'));

const GovernanceGuideBox = lazy(
  () => import('src/components/Governance/GovernanceGuideBox'),
);

interface Props {
  headerRef: RefObject<HTMLDivElement>;
  getMainnetType: MainnetType;
}

const ElfiTitle: React.FC<Props> = ({ headerRef, getMainnetType }) => {
  const { t } = useTranslation();

  return (
    <>
      <div ref={headerRef} className="staking__title">
        <h2>
          {t('staking.staking__token', {
            token: Token.ELFI.toUpperCase(),
          })}
        </h2>
        <>
          <p>{t('staking.elfi.staking__content')}</p>

          <div
            className={`staking__title__token${
              getMainnetType === MainnetType.Ethereum ? '--uniswap' : ''
            }`}>
            {(getMainnetType === MainnetType.Ethereum
              ? [
                  {
                    linkName: 'uniswap',
                    link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4',
                    linkImage: Uniswap,
                  },
                ]
              : [
                  {
                    linkName: 'pancakeswap',
                    link: 'https://pancakeswap.finance/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=0x6c619006043eab742355395690c7b42d3411e8c0',
                    linkImage: PancakeSwap,
                  },
                  {
                    linkName: 'wormhole',
                    link: 'https://portalbridge.com/#/transfer',
                    linkImage: Wormhole,
                  },
                ]
            ).map((value, index) => {
              return (
                <Suspense fallback={null} key={index}>
                  <TitleButton
                    key={`btn_${index}`}
                    buttonName={t(
                      `staking.elfi.staking__content--button.${value.linkName}`,
                    )}
                    link={value.link}
                    linkName={value.linkName}
                    linkImage={value.linkImage}
                  />
                </Suspense>
              );
            })}
          </div>
        </>
      </div>
      <section className="governance__elyfi-graph">
        <Suspense fallback={<div style={{ height: 120 }} />}>
          <GovernanceGuideBox />
        </Suspense>
      </section>
    </>
  );
};

export default ElfiTitle;
