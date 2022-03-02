import axios, { AxiosResponse } from 'axios';
import MainnetType from 'src/enums/MainnetType';
import { request } from 'graphql-request';

export interface TopicList {
  images: TopicList[] | undefined;
  topic_list: {
    topics: {
      id: number;
      title: string;
    }[];
  };
}

export interface IOffChainVote {
  html: string;
  id: string;
  votes: number;
}
[];

export interface INapData {
  id: number;
  nap: string;
  status: string;
  images: string;
  votes: IOffChainVote[];
  totalVoters: number;
  link: string;
  endedDate: string;
  network: MainnetType;
}

export const topicListFetcher = (url: string): Promise<TopicList[]> =>
  axios.get(url).then((res) => res.data);

export default class OffChainTopic {
  static getTopicResult = async (topicID: number): Promise<AxiosResponse> => {
    return axios.get(`/proxy/t/${topicID}.json`);
  };
}
