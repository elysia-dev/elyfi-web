import { ERC20 } from "@elysia-dev/contract-typechain";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, constants } from "ethers";
import { useCallback, useEffect, useState } from "react";
import useERC20 from "./useERC20";

interface IERC20Info {
	balance: BigNumber,
	allowance: BigNumber,
	loading: boolean,
	error: string | null,
	refetch: () => void
	contract: ERC20
}

const useERC20Info = (contractAddress: string, targetAddress: string): IERC20Info => {
	const { account } = useWeb3React();
	const contract = useERC20(contractAddress);
	const [state, setState] = useState<{ allowance: BigNumber, balance: BigNumber, loading: boolean, error: string | null }>({
		allowance: constants.Zero,
		balance: constants.Zero,
		loading: true,
		error: null,
	});

	const load = useCallback(async (account: string) => {
		setState({
			...state,
			loading: true,
		})

		const balance = await contract.balanceOf(account);
		const allowance = await contract.allowance(account, targetAddress);

		setState({
			...state,
			allowance,
			balance,
			loading: false,
		})
	}, [contract, targetAddress, state])

	useEffect(() => {
		if (account) {
			load(account)
		}
	}, [account])

	return {
		...state,
		refetch: () => { account && load(account) },
		contract,
	}
}

export default useERC20Info