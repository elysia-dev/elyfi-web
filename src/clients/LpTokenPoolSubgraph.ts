import axios, { AxiosResponse } from 'axios';
import { TokenInfo } from 'src/core/types/Position';
import envs from 'src/core/envs';

export interface ITokenInfo {
  data: {
    positions: TokenInfo[];
  };
}

const baseUrl = envs.lpTokenPoolSubgraphURL;

export class LpTokenPoolSubgraph {
  static getPositionsByOwner = async (
    owner: string,
  ): Promise<AxiosResponse<ITokenInfo>> => {
    return axios.post(baseUrl, {
      query: `
      {
        positions(where: {owner: "${owner}"}){
            id,
          liquidity
          pool {
              id
            },
        }
      }
        `,
    });
  };
}

export default LpTokenPoolSubgraph;
