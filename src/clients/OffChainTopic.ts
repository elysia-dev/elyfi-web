import axios, { AxiosResponse } from 'axios';
import MainnetType from 'src/enums/MainnetType';

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
  network: MainnetType;
}

export default class OffChainTopic {
  static getTopicList = async (): Promise<AxiosResponse<TopicList>> => {
    return axios.get(`/proxy/c/nap/10.json`);
  };
  static getTopicResult = async (topicID: number): Promise<AxiosResponse> => {
    return axios.get(`/proxy/t/${topicID}.json`);
  };
}
