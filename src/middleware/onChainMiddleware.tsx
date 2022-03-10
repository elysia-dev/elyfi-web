import { useContext, useEffect, useRef, useState } from 'react';
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
        if (swr.data !== undefined) {
          dataRef.current = swr.data;
          const data: any = swr.data;
          const getNAPDatas = data.proposals
            .filter((proposal: any) => {
              return proposal.state === 'active';
            })
            .map((data: any) => {
              return {
                data: {
                  description: data.title,
                },
                status: data.state,
                timestamp: data.start.toString(),
                id: data.id,
              } as IProposals;
            });
          getNAPDatas.map((data: any, index: any) => {
            // if (index !== 0) return;
            setProposalId(data.id);
            return setOnChainData((_data: any) => {
              return [
                ..._data,
                {
                  data: {
                    description: data.data.description
                      .match(/\d.*(?!NAP)(?=:)/)
                      ?.toString(),
                  },
                  status: data.status,
                  id: data.id,
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

    useEffect(() => {
      if (!voteDatas) return;
      setOnChainData(() => [
        {
          ...onChainData[0],
          totalVotesCast: voteDatas.votes.length || 0,
          totalVotesCastAbstained:
            voteDatas.votes.filter((vote: any) => vote.choice === 3).length ||
            0,
          totalVotesCastAgainst:
            voteDatas.votes.filter((vote: any) => vote.choice === 2).length ||
            0,
          totalVotesCastInSupport:
            voteDatas.votes.filter((vote: any) => vote.choice === 1).length ||
            0,
        },
      ]);
    }, [voteDatas]);

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
        if (swr.data !== undefined) {
          dataRef.current = swr.data;
          const getOnChainApis: any = swr.data;
          const getNAPCodes = getOnChainApis.proposals.filter((topic: any) => {
            return topic.status === 'ACTIVE';
          });
          getNAPCodes.map((data: any) => {
            return setOnChainData((_data: any) => {
              if (!(data.status === 'ACTIVE')) return [..._data];
              return [
                ..._data,
                {
                  data: {
                    description: data.data.description
                      .match(/\d.*(?!NAP)(?=:)/)
                      ?.toString(),
                  },
                  status: data.status,
                  totalVotesCast: data.totalVotesCast,
                  totalVotesCastAbstained: data.totalVotesCastAbstained,
                  totalVotesCastAgainst: data.totalVotesCastAgainst,
                  totalVotesCastInSupport: data.totalVotesCastInSupport,
                  id: data.id.match(/(?=).*(?=-proposal)/)?.toString(),
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
