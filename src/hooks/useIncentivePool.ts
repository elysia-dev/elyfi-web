import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { IncentivePool__factory } from "@elysia-dev/contract-typechain";
import envs from "src/core/envs";

const useIncentivePool = () => {
	const { library } = useWeb3React();
	const contract = useMemo(() => {
		return IncentivePool__factory.connect(
			envs.incentivePoolAddress,
			library.getSigner()
		)
	}, [library])

	return contract;
}

export default useIncentivePool