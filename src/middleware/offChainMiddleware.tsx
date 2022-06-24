import { useEffect, useRef, useState } from 'react';
import { Middleware, SWRHook } from 'swr';

import OffChainTopic, {
  INapData,
  IOffChainVote,
} from 'src/clients/OffChainTopic';
import MainnetType from 'src/enums/MainnetType';

export const offChainElyIPMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const dataRef = useRef<any>(null);
    const htmlParser = new DOMParser();
    const [offChainLoading, setOffChainLoading] = useState(true);
    const [offChainElyIPData, setOffChainElyIPData] = useState<
      {
        title: string;
        created_at: Date;
        link: string;
      }[]
    >([]);

    useEffect(() => {
      try {
        if (swr.data !== undefined) {
          setOffChainElyIPData([]);
          dataRef.current = swr.data;
          const getOffChainApis: any = swr.data;
          const getElyIPTitles = getOffChainApis.topic_list.topics.filter(
            (topic: any) => {
              return topic.title.startsWith('ELYIP');
            },
          );
          Array(3)
            .fill(0)
            .forEach(async (_v, idx) => {
              const getElyIPData = await OffChainTopic.getTopicResult(
                getElyIPTitles[idx].id,
              );
              const getHTMLStringData: string =
                getElyIPData.data.post_stream.posts[0].cooked.toString();
              const parsedHTMLData = htmlParser.parseFromString(
                getHTMLStringData,
                'text/html',
              );
              const regexNap = /ELYIP\d+/;
              const regexNetwork = /Network: BSC.*(?=<)/;
              const summary =
                parsedHTMLData.body.querySelectorAll('p')[2].textContent;
              const blockquoteTags =
                parsedHTMLData.querySelectorAll('blockquote')[0];
              const title = blockquoteTags.querySelectorAll('p')[0].textContent;

              setOffChainElyIPData((elyIP: any) => [
                ...elyIP,
                {
                  id: getElyIPTitles[idx].id,
                  nap: `ELYIP ${
                    getElyIPData.data.title.match(regexNap)?.[0].substring(5) ||
                    ''
                  }`,
                  status:
                    getHTMLStringData
                      .match(/Status: .*(?=<)/)
                      ?.toString()
                      .split('Status: ') || '',
                  link: `https://forum.elyfi.world/t/${getElyIPData.data.slug}/${getElyIPTitles[idx].id}`,
                  endedDate: getElyIPData.data.post_stream.posts[0].polls
                    ? getElyIPData.data.post_stream.posts[0].polls[0].close
                    : '',
                  network:
                    !!getHTMLStringData.match(regexNetwork) === true
                      ? MainnetType.BSC
                      : MainnetType.Ethereum,
                  summary,
                  title: title?.substring(
                    title?.indexOf('Title:') + 6,
                    title?.indexOf('Network:'),
                  ),
                } as INapData,
              ]);
            });
        }
        setOffChainLoading(false);
      } catch (error) {
        setOffChainLoading(false);
      }
    }, [swr.data]);

    const data = swr.data === undefined ? dataRef.current : offChainElyIPData;

    return { ...swr, data, isValidating: offChainLoading };
  };

export const offChainGovernanceMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const dataRef = useRef<any>(null);
    const htmlParser = new DOMParser();
    const [offChainLoading, setOffChainLoading] = useState(true);
    const [offChainElyIPData, setOffChainElyIPData] = useState<
      {
        title: string;
        created_at: Date;
        link: string;
      }[]
    >([]);

    useEffect(() => {
      try {
        if (swr.data !== undefined) {
          setOffChainElyIPData([]);
          dataRef.current = swr.data;
          const getOffChainApis: any = swr.data;
          const getNAPTitles = getOffChainApis.topic_list.topics.filter(
            (topic: any) => {
              return topic.title.startsWith('NAP');
            },
          );
          Array(3)
            .fill(0)
            .forEach(async (_v, idx) => {
              const getNATData = await OffChainTopic.getTopicResult(
                getNAPTitles[idx].id,
              );
              const getHTMLStringData: string =
                getNATData.data.post_stream.posts[0].cooked.toString();
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
              const summary =
                parsedHTMLData.body.querySelectorAll('p')[1].textContent;
              const blockquoteTags =
                parsedHTMLData.querySelectorAll('blockquote')[0];
              const title =
                blockquoteTags.querySelectorAll('ul > li')[1].textContent;
              setOffChainElyIPData((elyIP: any) => [
                ...elyIP,
                {
                  id: getNAPTitles[idx].id,
                  nap: `NAP ${
                    getHTMLStringData
                      .match(regexNap)
                      ?.toString()
                      .substring(5) || ''
                  }`,
                  status:
                    getHTMLStringData
                      .match(/Status: .*(?=<)/)
                      ?.toString()
                      .split('Status: ') || '',
                  link: `https://forum.elyfi.world/t/${getNATData.data.slug}`,
                  endedDate: getNATData.data.post_stream.posts[0].polls
                    ? getNATData.data.post_stream.posts[0].polls[0].close
                    : '',
                  createdAt: getNATData.data.post_stream.posts[0].created_at,
                  network:
                    !!getHTMLStringData.match(regexNetwork) === true
                      ? MainnetType.BSC
                      : MainnetType.Ethereum,
                  summary,
                  title: title?.substring(6),
                } as INapData,
              ]);
            });
        }
        setOffChainLoading(false);
      } catch (error) {
        setOffChainLoading(false);
      }
    }, [swr.data]);

    const data = swr.data === undefined ? dataRef.current : offChainElyIPData;

    return { ...swr, data, isValidating: offChainLoading };
  };

const offChainMainMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const dataRef = useRef<any>(null);
    const [offChainElyIPData, setOffChainElyIPData] = useState<
      {
        title: string;
        created_at: Date;
        link: string;
      }[]
    >([]);

    useEffect(() => {
      if (swr.data !== undefined) {
        setOffChainElyIPData([]);
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
            setOffChainElyIPData((elyIP: any) => [
              ...elyIP,
              {
                title: getNATData.data.title,
                created_at: dates,
                link: `https://forum.elyfi.world/t/${getNATData.data.slug}`,
              },
            ]);
          });
      }
    }, [swr.data]);

    const data = swr.data === undefined ? dataRef.current : offChainElyIPData;

    return { ...swr, data };
  };

export default offChainMainMiddleware;
