import axios, { AxiosResponse } from "axios";
import { BigNumber } from "ethers";

export interface IProposals {
  data: {
    description: string
  },
  status: string,
  totalVotesCast: BigNumber,
  totalVotesCastAbstained: BigNumber, 
  totalVotesCastAgainst: BigNumber,
  totalVotesCastInSupport: BigNumber,
  timestamp: string,
  id: string
}
export interface IOnChainToipc {
  data: {
    proposals: IProposals[];
  }
}

export class OnChainTopic {
  static getOnChainTopicData = async (): Promise<AxiosResponse<IOnChainToipc>> => {
    return axios.post("https://api.thegraph.com/subgraphs/name/withtally/elyfi-finance-protocol", {
      query: `
      {
        proposals {
          status
          data {
            description
          }
          totalVotesCast
          totalVotesCastAgainst
          totalVotesCastInSupport
          totalVotesCastAbstained
          timestamp
          id
        }
      }`
    })
  }
}