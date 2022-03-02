import { BigNumber } from 'ethers';
import { request } from 'graphql-request';

export interface IProposals {
  data: {
    description: string;
  };
  status: string;
  totalVotesCast: BigNumber;
  totalVotesCastAbstained: BigNumber;
  totalVotesCastAgainst: BigNumber;
  totalVotesCastInSupport: BigNumber;
  timestamp: string;
  id: string;
}
export interface IOnChainToipc {
  proposals: IProposals[];
}

export const onChainFetcher = (query: string): Promise<IOnChainToipc[]> =>
  request(
    'https://api.thegraph.com/subgraphs/name/withtally/elyfi-finance-protocol',
    query,
  );
