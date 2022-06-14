import { useEffect, useRef, useState } from 'react';
import { Middleware, SWRHook } from 'swr';

import OffChainTopic, {
  INapData,
  IOffChainVote,
} from 'src/clients/OffChainTopic';
import MainnetType from 'src/enums/MainnetType';

export const offChainGovernanceMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const dataRef = useRef<any>(null);
    const [offChainLoading, setOffChainLoading] = useState(true);
    const [offChainNapData, setOffChainNapData] = useState<
      {
        title: string;
        created_at: Date;
        link: string;
      }[]
    >([]);

    useEffect(() => {
      try {
        if (swr.data !== undefined) {
          setOffChainNapData([]);
          dataRef.current = swr.data;
          const getOffChainApis: any = swr.data;
          const getNAPTitles = getOffChainApis.topic_list.topics.filter(
            (topic: any) => {
              return topic.title.startsWith('NAP');
            },
          );
          getNAPTitles
            .map((title: any) => title.id)
            .map(async (_res: any, _x: any) => {
              const getNATData = await OffChainTopic.getTopicResult(_res);
              const getHTMLStringData: string =
                getNATData.data.post_stream.posts[0].cooked.toString();
              const htmlParser = new DOMParser();
              const parsedHTMLData = htmlParser.parseFromString(
                getHTMLStringData,
                'text/html',
              );
              const getAllAnchorTag = parsedHTMLData.body.querySelectorAll('a');
              const result = Array.from(getAllAnchorTag).find((arrayData) => {
                return (
                  arrayData.innerHTML.toLocaleLowerCase() === 'collateral image'
                );
              });
              const regexNap = /NAP#: .*(?=<)/;
              const regexNetwork = /Network: BSC.*(?=<)/;
              setOffChainNapData((napData: any) => [
                ...napData,
                {
                  id: _x,
                  nap:
                    getHTMLStringData
                      .match(regexNap)
                      ?.toString()
                      .substring(5) || '',
                  status:
                    getHTMLStringData
                      .match(/Status: .*(?=<)/)
                      ?.toString()
                      .split('Status: ') || '',
                  images: result?.href || '',
                  votes: getNATData.data.post_stream.posts[0].polls
                    ? getNATData.data.post_stream.posts[0].polls[0].options
                    : ([
                        { id: '', html: '', votes: 1 },
                        { id: '', html: '', votes: 1 },
                      ] as IOffChainVote[]),
                  totalVoters: getNATData.data.post_stream.posts[0].polls
                    ? getNATData.data.post_stream.posts[0].polls[0].voters
                    : 0,
                  link: `https://forum.elyfi.world/t/${getNATData.data.slug}`,
                  endedDate: getNATData.data.post_stream.posts[0].polls
                    ? getNATData.data.post_stream.posts[0].polls[0].close
                    : '',
                  network:
                    !!getHTMLStringData.match(regexNetwork) === true
                      ? MainnetType.BSC
                      : MainnetType.Ethereum,
                } as INapData,
              ]);
            });
        }
        setOffChainLoading(false);
      } catch (error) {
        setOffChainLoading(false);
      }
    }, [swr.data]);

    const data = swr.data === undefined ? dataRef.current : offChainNapData;

    return { ...swr, data, isValidating: offChainLoading };
  };

const offChainMainMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const dataRef = useRef<any>(null);
    const [offChainNapData, setOffChainNapData] = useState<
      {
        title: string;
        created_at: Date;
        link: string;
      }[]
    >([]);

    useEffect(() => {
      if (swr.data !== undefined) {
        setOffChainNapData([]);
        dataRef.current = swr.data;
        const getOffChainApis: any = swr.data;
        const getNAPTitles = getOffChainApis.topic_list.topics.filter(
          (topic: any) => {
            return topic.title.startsWith('NAP');
          },
        );
        if (!getNAPTitles.map((title: any) => title.id) || undefined) return;
        getNAPTitles
          .map((title: any) => title.id)
          .map(async (_res: any, _x: any) => {
            const getNATData = await OffChainTopic.getTopicResult(_res);
            const dates: Date = new Date(getNATData.data.created_at);
            setOffChainNapData((napData: any) => [
              ...napData,
              {
                title: getNATData.data.title,
                created_at: dates,
                link: `https://forum.elyfi.world/t/${getNATData.data.slug}`,
              },
            ]);
          });
      }
    }, [swr.data]);

    const data = swr.data === undefined ? dataRef.current : offChainNapData;

    return { ...swr, data };
  };

export default offChainMainMiddleware;
