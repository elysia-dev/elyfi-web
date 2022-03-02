import { FunctionComponent, RefObject, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useSWR from 'swr';

import { topicListFetcher } from 'src/clients/OffChainTopic';
import { onChainFetcher } from 'src/clients/OnChainTopic';
import onChainMainMiddleware from 'src/middleware/onChainMiddleware';
import offChainMainMiddleware from 'src/middleware/offChainMiddleware';
import { onChainQuery } from 'src/queries/onChainQuery';

type Props = {
  governancePageY: RefObject<HTMLParagraphElement>;
  governancePageBottomY: RefObject<HTMLParagraphElement>;
};

const MainGovernanceTable: FunctionComponent<Props> = ({
  governancePageY,
  governancePageBottomY,
}) => {
  const { data: onChainData } = useSWR(onChainQuery, onChainFetcher, {
    use: [onChainMainMiddleware],
  });

  const { data: offChainData } = useSWR(
    '/proxy/c/nap/10.json',
    topicListFetcher,
    { use: [offChainMainMiddleware] },
  );
  const [selectButton, setSelectButton] = useState(false);

  const [moreload, setMoreload] = useState(false);

  const { t } = useTranslation();

  return (
    <div ref={governancePageY} className="main__governance main__section">
      <h2>
        <Trans i18nKey="main.governance.title" />
      </h2>
      <div className="main__governance__table">
        <div className="main__governance__converter">
          <div
            className={`main__governance__converter__button ${
              selectButton ? 'disable' : ''
            }`}
            onClick={() => {
              setSelectButton(false);
            }}>
            <h2>{t('main.governance.data-verification')}</h2>
          </div>
          <div
            className={`main__governance__converter__button ${
              !selectButton ? 'disable' : ''
            }`}
            onClick={() => {
              setSelectButton(true);
            }}>
            <h2>{t('main.governance.onchain-vote')}</h2>
          </div>
        </div>
        <hr />
        <div className="main__governance__content">
          <div className="main__governance__header">
            <p>{t('main.governance.table--title')}</p>
            <p>{t('main.governance.table--date')}</p>
          </div>
          {(!selectButton
            ? [...(offChainData || [])].sort((a: any, b: any) => {
                return b.created_at! > a.created_at! ? 1 : -1;
              }) || []
            : onChainData
            ? [...(onChainData || [])].sort((a: any, b: any) => {
                return b.created_at! > a.created_at! ? 1 : -1;
              })
            : []
          ).map((_data: any, index) => {
            return (
              <div
                className="main__governance__body"
                style={{ display: index >= 5 && !moreload ? 'none' : 'flex' }}
                onClick={() => window.open(_data.link)}>
                <p>{_data.title}</p>
                <p>
                  {_data.created_at.getFullYear()}.
                  {_data.created_at.getMonth() + 1 < 10
                    ? `0${_data.created_at.getMonth() + 1}`
                    : _data.created_at.getMonth() + 1}
                  .
                  {_data.created_at.getDate() < 10
                    ? `0${_data.created_at.getDate()}`
                    : _data.created_at.getDate()}
                </p>
              </div>
            );
          })}
        </div>
        <div
          ref={governancePageBottomY}
          className="main__governance__more"
          onClick={() => setMoreload(!moreload)}>
          <p>
            {moreload
              ? t('main.governance.view-more--disable')
              : t('main.governance.view-more')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainGovernanceTable;
