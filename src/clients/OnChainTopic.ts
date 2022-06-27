import axios, { AxiosResponse } from 'axios';
import { BigNumber } from 'ethers';
import { request } from 'graphql-request';

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
  summary: string;
  title: string;
}
export interface IOnChainTopic {
  proposals: IProposals[];
}

export const onChainFetcher = (query: string): Promise<IOnChainTopic[]> =>
  request(
    'https://api.thegraph.com/subgraphs/name/withtally/elyfi-finance-protocol',
    query,
  );

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

export const onChainBscFetcher = (query: string): Promise<IBSCOnChainTopic[]> =>
  request('https://hub.snapshot.org/graphql', query);

export const bscOnChainQuery = (
  space: string,
): string => `query Proposals($space_in: [String]) {
  proposals(
        first: 10
        skip: 0
        where: {
          space: "${space}", 
          state: "all", 
          space_in: $space_in, 
          author_in: []
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
        }`;

type VotesType = {
  votes: {
    id: string;
    voter: string;
    created: number;
    choice: number;
    space: {
      id: string;
    };
  }[];
};

export const onChainBscVoteFetcher = (query: string): Promise<VotesType> =>
  request('https://hub.snapshot.org/graphql ', query);

export const bscOnChainVoteQuery = (id: string): string => `
   query Votes {
  votes (
    first: 1000
    where: {
      proposal: "${id}"
    }
  ) {
    id
    voter
    created
    choice
    space {
      id
    }
  }
}
  `;
export class OnChainTopic {
  static getBscOnChainTopicData = async (): Promise<
    AxiosResponse<IBSCOnChainTopic>
  > => {
    return axios.post('https://hub.snapshot.org/graphql', {
      // operationName: 'Proposals',
      variables: {
        // first: 10,
        // skip: 0,
        // space:
        // process.env.NODE_ENV === 'production' &&
        // !process.env.REACT_APP_TEST_MODE
        //   ? 'elyfi-bsc.eth'
        //   : 'test-elyfi-bsc.eth',
        // state: 'all',
        // author_in: [],
      },
      query: `query Proposals($space_in: [String]) {
              proposals(
                    first: 10
                    skip: 0
                    where: {
                      space: "test-elyfi-bsc.eth", 
                      state: "all", 
                      space_in: $space_in, 
                      author_in: []
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
