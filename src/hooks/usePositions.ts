import { BigNumber, Contract } from 'ethers';
import { useCallback, useState } from 'react';
import envs from 'src/core/envs';
import abi from 'src/core/abi/NonfungiblePositionManager.json';
import getProvider from 'src/core/utils/getProvider';

export interface Position {
  tokenId: number;
  token0: string;
  token1: string;
  liquidity: BigNumber;
}

const provider = getProvider();

const UniswapV3NFT = new Contract(
  envs.nonFungiblePositionAddress,
  abi,
  provider,
);

const usePositions = (
  owner: string | undefined | null,
): {
  positions: Position[];
  fetchPositions: () => Promise<void>;
} => {
  const [positions, setPositions] = useState<Position[]>([]);

  const fetchPositions = useCallback(async () => {
    if (!owner) return;
    const balance = (await UniswapV3NFT.balanceOf(owner)) || 0;

    const fetchedPositions = [];
    for (let i = 0; i < balance; i += 1) {
      const tokenId = (await UniswapV3NFT.tokenOfOwnerByIndex(
        owner,
        i,
      )) as BigNumber;
      const data = await UniswapV3NFT.positions(tokenId);

      fetchedPositions.push({
        tokenId: tokenId.toNumber(),
        token0: data.token0,
        token1: data.token1,
        liquidity: data.liquidity,
      });
    }

    setPositions(fetchedPositions);
  }, [owner]);

  return { positions, fetchPositions };
};

export default usePositions;
