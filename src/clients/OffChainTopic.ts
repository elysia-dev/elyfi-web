import axios, { AxiosResponse } from 'axios';

export interface TopicList {
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
}

const baseURL =
  process.env.NODE_ENV === 'development' ? '/' : 'https://forum.elyfi.world/';

export default class OffChainTopic {
  static getTopicList = async (): Promise<AxiosResponse<TopicList>> => {
    return axios.get(`${baseURL}/c/nap/10.json`);
  };
  static getTopicResult = async (topicID: number): Promise<AxiosResponse> => {
    return axios.get(`${baseURL}/t/${topicID}.json`);
  };
}
