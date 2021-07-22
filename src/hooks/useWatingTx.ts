import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEffect, useState } from "react";

const useWatingTx = (txHash: string): { wating: boolean } => {
	const { library } = useWeb3React()
	const [wating, setWating] = useState<boolean>(false);

	const waitTx = async (txHash: string) => {
		setWating(true);
		try {
			await (library as providers.Web3Provider).waitForTransaction(txHash);
		} finally {
			setWating(false);
		}
	}

	useEffect(() => {
		if (!txHash) return;

		waitTx(txHash)
	}, [txHash])

	return { wating }
}

export default useWatingTx