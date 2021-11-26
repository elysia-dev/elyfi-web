import axios, { AxiosResponse } from 'axios';

export interface TopicList {
  topic_list: {
    topics: {
      id: number;
      title: string;
    }[]
  }
}

export default class OffChainTopic {
  static getTopicList = async (): Promise<AxiosResponse<TopicList>> => {
    return axios.get("/c/nap/10.json");
  }
  
  static getTopicResult = async (
    topicID: number
  ): Promise<AxiosResponse> => {
    return axios.get(`/t/${topicID}.json`)
  }
}