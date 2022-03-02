import axios, { AxiosResponse } from 'axios';
import { BigNumber } from 'ethers';

export interface IProposals {
  data: {
    description: string;
  };
  status: string;
  totalVotesCast: BigNumber | number;
  totalVotesCastAbstained: BigNumber | number;
  totalVotesCastAgainst: BigNumber | number;
  totalVotesCastInSupport: BigNumber | number;
  timestamp: string;
  id: string;
}
export interface IOnChainTopic {
  data: {
    proposals: IProposals[];
  };
}

export interface IBSCOnChainTopic {
  data: {
    proposals: {
      id: string;
      ipfs: string;
      title: string;
      body: string;
      start: number;
      end: number;
      state: string;
      author: string;
      created: number;
      choices: [];
      space: {
        id: string;
        name: string;
        members: string[];
        avatar: string;
        symbol: string;
      };
      scores_state: string;
      scores_total: number;
      scores: number[];
      votes: string;
    }[];
  };
}

export class OnChainTopic {
  static getOnChainTopicData = async (): Promise<
    AxiosResponse<IOnChainTopic>
  > => {
    return axios.post(
      'https://api.thegraph.com/subgraphs/name/withtally/elyfi-finance-protocol',
      {
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
      }`,
      },
    );
  };

  static getBscOnChainTopicData = async (): Promise<
    AxiosResponse<IBSCOnChainTopic>
  > => {
    return axios.post('https://hub.snapshot.org/graphql', {
      operationName: 'Proposals',
      variables: {
        first: 10,
        skip: 0,
        space: process.env.NODE_ENV === 'production' && !process.env.REACT_APP_TEST_MODE ? 'elyfi-bsc.eth' : "test-elyfi-bsc.eth",
        state: 'all',
        author_in: [],
      },
      query: `query Proposals($first: Int!, $skip: Int!, $state: String!, $space: String, $space_in: [String], $author_in: [String]) {
              proposals(
                    first: $first
                    skip: $skip
                    where: {
                      space: $space, 
                      state: $state, 
                      space_in: $space_in, 
                      author_in: $author_in
                    }
                      ) {
                            id
                            ipfs
                            title
                            body
                            start 
                            end  
                            state
                            author
                            created
                            choices
                            space {
                                    id
                                    name
                                    members
                                    avatar    
                                    symbol    
                                  }    
                            scores_state
                            scores_total
                            scores
                            votes
                        }
                    }`,
    });
  };
}
