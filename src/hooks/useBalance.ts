import { useWeb3React } from "@web3-react/core";
import { BigNumber, constants, Contract } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import getProviderOrSigner from "src/core/utils/getSignerOrProvider";
import ERC20Abi from 'src/core/abis/ERC20.json';

interface IUseBalance {
	balance: BigNumber,
	loading: boolean,
	error: string | null,
	loadBalance: () => void
}

const useBalance = (contractAddress: string): IUseBalance => {
	const { account, library } = useWeb3React()
	const [state, setState] = useState<{ value: BigNumber, loading: boolean, error: string | null }>({
		value: constants.Zero, loading: true, error: null,
	});
	const contract = useMemo(() => {
		return new Contract(contractAddress, ERC20Abi, getProviderOrSigner(library) as any);
	}, [contractAddress, library])

	const loadBalance = useCallback(async (account: string) => {
		if (!account || !contract) return constants.Zero;

		setState({
			...state,
			loading: true,
		})

		try {
			const value = await contract.balanceOf(account) as BigNumber

			setState({
				...state,
				value,
				loading: false
			})
		} catch (e) {
			setState({
				value: constants.Zero,
				loading: false,
				error: e
			})
		}

	}, [contract, state]);

	useEffect(() => {
		if (account) {
			loadBalance(account)
		}
	}, [account])

	return {
		balance: state.value,
		loading: state.loading,
		error: state.error,
		loadBalance: () => { if (account) loadBalance(account) }
	}
}

export default useBalance