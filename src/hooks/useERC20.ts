import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { ERC20__factory } from "@elysia-dev/contract-typechain";

const useERC20 = (address: string) => {
	const { library } = useWeb3React();
	const contract = useMemo(() => {
		return ERC20__factory.connect(
			address,
			library.getSigner()
		)
	}, [library, address])

	return contract;
}

export default useERC20