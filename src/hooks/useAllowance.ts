import { useWeb3React } from "@web3-react/core";
import { BigNumber, constants, Contract } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import getProviderOrSigner from "src/core/utils/getSignerOrProvider";
import ERC20Abi from 'src/core/abis/ERC20.json';

interface IUseAllowance {
	allowance: BigNumber,
	loading: boolean,
	error: string | null,
	increaseAllowance: () => Promise<string | null | undefined>,
	loadAllowance: () => void
}

const useAllownace = (contractAddress: string, targetAddress: string): IUseAllowance => {
	const { account, library } = useWeb3React()
	const [allowance, setAllowance] = useState<{ value: BigNumber, loading: boolean, error: string | null }>({
		value: constants.Zero, loading: true, error: null,
	});
	const contract = useMemo(() => {
		return new Contract(contractAddress, ERC20Abi, getProviderOrSigner(library) as any);
	}, [contractAddress, library])

	const loadAllowance = useCallback(async (account: string) => {
		if (!account || !contract) return constants.Zero;

		setAllowance({
			...allowance,
			loading: true,
		})

		try {
			const value = await contract.allowance(account, targetAddress) as BigNumber

			setAllowance({
				...allowance,
				value,
				loading: false
			})
		} catch (e) {
			setAllowance({
				value: constants.Zero,
				loading: false,
				error: e
			})
		}

	}, [contract, allowance, targetAddress]);

	const increaseAllowance = useCallback(async () => {
		const request = library.provider.request;

		if (!contract || !request) return;

		try {
			const populatedTransaction = await contract?.populateTransaction
				.approve(targetAddress, constants.MaxUint256);

			const txHash = await request({
				method: 'eth_sendTransaction',
				params: [
					{
						to: populatedTransaction.to,
						from: account,
						data: populatedTransaction.data,
					},
				],
			})

			return txHash;
		} catch (e) {
			console.log(e);
			return
		}
	}, [targetAddress, account, contract, library]);

	useEffect(() => {
		if (account) {
			loadAllowance(account)
		}
	}, [account])

	return {
		allowance: allowance.value,
		loading: allowance.loading,
		error: allowance.error,
		increaseAllowance,
		loadAllowance: () => { if (account) loadAllowance(account) }
	}
}

export default useAllownace