import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { StakingPool__factory } from "@elysia-dev/contract-typechain";
import envs from "src/core/envs";

const useStakingPool = (staked: 'EL' | 'ELFI') => {
	const { library } = useWeb3React();
	const contract = useMemo(() => {
		return StakingPool__factory.connect(
			staked === 'EL' ?
				envs.elStakingPoolAddress : envs.elfyStakingPoolAddress,
			library.getSigner()
		)
	}, [library, staked])

	return contract;
}

export default useStakingPool