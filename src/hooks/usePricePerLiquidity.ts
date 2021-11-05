import { useContext, useMemo } from 'react';
import PriceContext from 'src/contexts/PriceContext';
import { toCompact } from 'src/utiles/formatters';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import { utils } from 'ethers';

const usePricePerLiquidity = (): { pricePerDaiLiquidity: number, pricePerEthLiquidity: number } => {
	const { elfiPrice, daiPrice, ethPrice } = useContext(PriceContext);
	const {
		daiPool,
		ethPool,
	} = useContext(UniswapPoolContext);

	const pricePerEthLiquidity = useMemo(() => {
		return (ethPool.totalValueLockedToken0 * elfiPrice + ethPool.totalValueLockedToken1 * ethPrice)
			/ parseFloat(utils.formatEther(ethPool.liquidity))
	}, [ethPool, elfiPrice, ethPrice])

	const pricePerDaiLiquidity = useMemo(() => {
		return (daiPool.totalValueLockedToken0 * elfiPrice + daiPool.totalValueLockedToken1 * daiPrice)
			/ parseFloat(utils.formatEther(daiPool.liquidity))
	}, [daiPool, elfiPrice, daiPrice])

	return {
		pricePerEthLiquidity,
		pricePerDaiLiquidity
	}
}

export default usePricePerLiquidity;
