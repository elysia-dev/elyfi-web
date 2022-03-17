import axios, { AxiosResponse } from 'axios';
import { BigNumber } from 'ethers';
import Position from 'src/core/types/Position';
import envs from 'src/core/envs';
import request from 'graphql-request';
export interface IPosition {
  data: {
    positions: Position[];
  };
}

export interface IPoolPosition {
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
}

const baseUrl = envs.subgraphApiEndpoint.stakerSubgraphURL;

export const positionsByOwnerFetcher = (query: string): Promise<any> =>
  request(baseUrl, query);

export const positionsByOwnerQuery = (owner: string): string => `
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
  `;

export const positionsByPoolIdFetcher = (query: string): Promise<any> =>
  request(baseUrl, query);

export const positionsByPoolIdQuery = `
{
  daiIncentive: incentives(where: {pool: "${envs.lpStaking.daiElfiPoolAddress}"}){
   id
   incentivePotisions(where: {active: true}){
     position {
       id,
       liquidity,
     }
   }
 }
 wethIncentive: incentives(where: {pool: "${envs.lpStaking.ethElfiPoolAddress}"}){
   id
   incentivePotisions(where: {active: true}){
     position {
       id,
       liquidity
     }
   }
 }
}
  `;
