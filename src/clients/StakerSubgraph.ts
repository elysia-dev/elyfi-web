import axios, { AxiosResponse } from 'axios';
import { BigNumber } from 'ethers';
import Position from 'src/core/types/Position';
import envs from 'src/core/envs';
export interface IPosition {
  data: {
    positions: Position[];
  };
}

export interface IPoolPosition {
  data: {
    daiIncentive: {
      id: string;
      incentivePotisions: {
        position: {
          id: string;
          liquidity: BigNumber;
        };
      }[];
    }[];
    wethIncentive: {
      id: string;
      incentivePotisions: {
        position: {
          id: string;
          liquidity: string;
        };
      }[];
    }[];
  };
}

const baseUrl = envs.subgraphApiEndpoint.stakerSubgraphURL;

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
              id
              pool
              rewardToken
            }
          }
        }
      }
        `,
    });
  };

  static getIncentivesWithPositionsByPoolId = async (
    ethPoolId: string,
    daiPoolId: string,
  ): Promise<AxiosResponse<IPoolPosition>> => {
    return axios.post(baseUrl, {
      query: `
      {
        daiIncentive: incentives(where: {pool: "${daiPoolId}"}){
         id
         incentivePotisions(where: {active: true}){
           position {
             id,
             liquidity,
           }
         }
       }
       wethIncentive: incentives(where: {pool: "${ethPoolId}"}){
         id
         incentivePotisions(where: {active: true}){
           position {
             id,
             liquidity
           }
         }
       }
     }
        `,
    });
  };
}

export default StakerSubgraph;
