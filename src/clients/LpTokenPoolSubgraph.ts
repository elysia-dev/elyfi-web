import axios, { AxiosResponse } from 'axios';
import { BigNumber } from 'ethers';
import Position, { TokenInfo } from 'src/core/types/Position';

export interface ITokenInfo {
  data: {
    positions: TokenInfo[];
  };
}

const baseUrl =
  'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-rinkeby';

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
