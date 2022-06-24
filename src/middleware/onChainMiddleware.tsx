import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  bscOnChainVoteQuery,
  IProposals,
  onChainBscVoteFetcher,
} from 'src/clients/OnChainTopic';
import useSWR, { Middleware, SWRHook } from 'swr';

export const onChainGovernancBsceMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const [proposalId, setProposalId] = useState('');
    const swr = useSWRNext(key, fetcher, config);
    const { data: voteDatas } = useSWR(
      bscOnChainVoteQuery(proposalId ? proposalId : ''),
      onChainBscVoteFetcher,
    );
    const dataRef = useRef<any>(null);
    const [onChainLoading, setOnChainLoading] = useState(true);
    const [onChainData, setOnChainData] = useState<
      {
        title: string;
        created_at: Date;
        link: string;
      }[]
    >([]);

    useEffect(() => {
      try {
        if (swr.error) throw Error;
        if (swr.data !== undefined) {
          setOnChainData([]);
          dataRef.current = swr.data;
          const data: any = swr.data;

          Array(4)
            .fill(0)
            .forEach((_v, idx) => {
              const snapShotData = data.proposals[idx];
              const count =
                snapShotData.title.match(/(NAP\d+\s:)/g)?.[0].length;
              return setOnChainData((_data: any) => {
                console.log(_data);
                return [
                  ..._data,
                  {
                    data: {
                      description: `NAP ${snapShotData.title
                        .match(/\d.*(?!NAP)(?=:)/)
                        ?.toString()
                        .replace(/ /g, '')}`,
                    },
                    status: snapShotData.status,
                    id: snapShotData.id,
                    timestamp: snapShotData.end,
                    summary: snapShotData.body
                      .substring(
                        snapShotData.body.indexOf('**Summary**') + 15,
                        snapShotData.body.indexOf('**Collateral Details**'),
                      )
                      .trim(),
                    title: snapShotData.title.substring(0 + count),
                  } as IProposals,
                ];
              });
            });
        }
        setOnChainLoading(false);
      } catch (error) {
        setOnChainLoading(false);
      }
    }, [swr.data]);

    useEffect(() => {}, [voteDatas, proposalId]);

    const data = swr.data === undefined ? dataRef.current : onChainData;

    return { ...swr, data, isValidating: onChainLoading };
  };

export const onChainGovernanceMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const dataRef = useRef<any>(null);
    const [onChainLoading, setOnChainLoading] = useState(true);
    const [onChainData, setOnChainData] = useState<
      {
        title: string;
        created_at: Date;
        link: string;
      }[]
    >([]);

    useEffect(() => {
      try {
        if (swr.error) throw Error;
        if (swr.data !== undefined) {
          setOnChainData([]);
          dataRef.current = swr.data;
          const getOnChainApis: any = swr.data;
          const getNAPCodes = getOnChainApis.proposals.filter((topic: any) => {
            return topic.status !== 'ACTIVE';
          });
          getNAPCodes.map((data: any) => {
            return setOnChainData((_data: any) => {
              const count = data.data.description.match(/(# NAP\d+:)/g)?.[0]
                ? data.data.description.match(/(# NAP\d+:)/g)?.[0].length
                : data.data.description.match(/(# NAP\d+\s:)/)?.[0]
                ? data.data.description.match(/(# NAP\d+\s:)/)?.[0].length
                : data.data.description.match(/NAP\d+:/g)?.[0].length;

              if (!(data.status !== 'ACTIVE')) return [..._data];
              return [
                ..._data,
                {
                  data: {
                    description: `NAP ${data.data.description
                      .match(/\d.*(?!NAP)(?=:)/)
                      ?.toString()}`,
                  },
                  status: data.status,
                  totalVotesCast: data.totalVotesCast,
                  totalVotesCastAbstained: data.totalVotesCastAbstained,
                  totalVotesCastAgainst: data.totalVotesCastAgainst,
                  totalVotesCastInSupport: data.totalVotesCastInSupport,
                  id: data.id.match(/(?=).*(?=-proposal)/)?.toString(),
                  summary: data.data.description.substring(
                    data.data.description.indexOf('**Summary**') + 11,
                    data.data.description.indexOf('**Collateral Details**'),
                  ),
                  title: data.data.description.substring(
                    0 + count,
                    data.data.description.indexOf('**Summary**'),
                  ),
                } as IProposals,
              ];
            });
          });
        }
        setOnChainLoading(false);
      } catch (error) {
        setOnChainLoading(false);
      }
    }, [swr.data]);

    const data = swr.data === undefined ? dataRef.current : onChainData;

    return { ...swr, data, isValidating: onChainLoading };
  };

const onChainMainMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const { t } = useTranslation();
    const dataRef = useRef<any>(null);
    const [onChainData, setOnChainData] = useState<
      {
        title: string;
        created_at: Date;
        link: string;
      }[]
    >([]);

    useEffect(() => {
      if (swr.data !== undefined) {
        dataRef.current = swr.data;
        const getOnChainApis: any = swr.data;
        const getNAPCodes = getOnChainApis.proposals.filter((topic: any) => {
          return topic.data.description.startsWith('NAP');
        });
        if (!getNAPCodes || undefined) return;

        getNAPCodes.map((data: any) => {
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
      }
    }, [swr.data]);

    const data = swr.data === undefined ? dataRef.current : onChainData;

    return { ...swr, data };
  };

export default onChainMainMiddleware;
