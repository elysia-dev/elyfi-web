import axios, { AxiosResponse } from 'axios';
import { BigNumber } from 'ethers';
import Position from 'src/core/types/Position';

export interface IPosition {
  data: {
    positions: Position[];
  };
}

const baseUrl =
  'https://api.studio.thegraph.com/query/862/lp-staking-rinkeby/v0.0.4';

export class StakerSubgraph {
  static getPositionsByOwner = async (
    owner: string,
  ): Promise<AxiosResponse<IPosition>> => {
    return axios.post(baseUrl, {
      query: `
      {
        positions(where: {owner: "${owner}"}){
          id
          tokenId
          owner
          staked
          liquidity
          incentivePotisions(where: {active: true}){
            incentive{
              pool
              rewardToken
            }
          }
        }
      }
        `,
    });
  };
}

export default StakerSubgraph;
