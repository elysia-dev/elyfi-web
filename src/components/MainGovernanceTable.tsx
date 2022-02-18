import { FunctionComponent, RefObject, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useSWR from 'swr';

import OffChainTopic, {
  TopicList,
  topicListFetcher,
} from 'src/clients/OffChainTopic';
import {
  IOnChainToipc,
  onChainFetcher,
  onChainQuery,
} from 'src/clients/OnChainTopic';

type Props = {
  governancePageY: RefObject<HTMLParagraphElement>;
  governancePageBottomY: RefObject<HTMLParagraphElement>;
};

const MainGovernanceTable: FunctionComponent<Props> = ({
  governancePageY,
  governancePageBottomY,
}) => {
  const { data: getOnChainData, error: onChainDataError } = useSWR(
    onChainQuery,
    onChainFetcher,
  );
  const { data: getOffChainData, error: offChainDataError } = useSWR(
    '/proxy/c/nap/10.json',
    topicListFetcher,
  );
  const [selectButton, setSelectButton] = useState(false);
  // const [onChainLoading, setOnChainLoading] = useState(true);
  // const [offChainLoading, setOffChainLoading] = useState(true);
  const [onChainData, setOnChainData] = useState<
    {
      title: string;
      created_at: Date;
      link: string;
    }[]
  >([]);
  const [offChainNapData, setOffChainNapData] = useState<
    {
      title: string;
      created_at: Date;
      link: string;
    }[]
  >([]);
  const [moreload, setMoreload] = useState(false);

  const { t } = useTranslation();

  const getOnChainNAPDatas = (getOnChainData: IOnChainToipc) => {
    const getOnChainApis = getOnChainData;
    const getNAPCodes = getOnChainApis.proposals.filter((topic) => {
      return topic.data.description.startsWith('NAP');
    });
    if (!getNAPCodes || undefined) return;

    getNAPCodes.map((data) => {
      const dates: Date = new Date(parseInt(data.timestamp, 10) * 1000);
      const getDataId = data.id.match(/(?=).*(?=-proposal)/)?.toString();
      return setOnChainData((_data) => [
        ..._data,
        {
          title: data.data.description.match(/NAP.*/)?.toString() || '',
          created_at: dates,
          link: `${t('governance.link.tally')}/proposal/${getDataId}`,
        },
      ]);
    });
  };

  const getOffChainNAPTitles = async (getOffChainData: TopicList) => {
    const getOffChainApis = getOffChainData;
    const getNAPTitles = getOffChainApis.topic_list.topics.filter((topic) => {
      return topic.title.startsWith('NAP');
    });
    if (!getNAPTitles.map((title) => title.id) || undefined) return;
    getNAPTitles
      .map((title) => title.id)
      .map(async (_res, _x) => {
        const getNATData = await OffChainTopic.getTopicResult(_res);
        const dates: Date = new Date(getNATData.data.created_at);
        setOffChainNapData((napData) => [
          ...napData,
          {
            title: getNATData.data.title,
            created_at: dates,
            link: `https://forum.elyfi.world/t/${getNATData.data.slug}`,
          },
        ]);
      });
  };

  useEffect(() => {
    try {
      if (onChainDataError || offChainDataError) throw Error;
      if (getOnChainData && getOffChainData) {
        getOnChainNAPDatas(getOnChainData);
        getOffChainNAPTitles(getOffChainData);
      }
    } catch (error) {
      console.error(error);
    }
  }, [getOnChainData, getOffChainData, onChainDataError, offChainDataError]);

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
            ? [...(offChainNapData || [])].sort((a, b) => {
                return b.created_at! > a.created_at! ? 1 : -1;
              }) || []
            : [...(onChainData || [])].sort((a, b) => {
                return b.created_at! > a.created_at! ? 1 : -1;
              }) || []
          ).map((_data, index) => {
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
