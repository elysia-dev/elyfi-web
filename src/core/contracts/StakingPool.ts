import { providers, Contract, BigNumber } from "ethers"
import envs from 'src/core/envs';
import StakingPoolAbi from 'src/core/abis/StakingPool.json';
import getProviderOrSigner from "../utils/getSignerOrProvider";

interface IPoolData {
	rewardPerSecond: BigNumber
	rewardIndex: BigNumber
	startTimestamp: BigNumber
	endTimestamp: BigNumber
	totalPrincipal: BigNumber
	lastUpdateTimestamp: BigNumber
}

class StakingPool {
	contract: Contract;
	request: ((request: {
		method: string;
		params?: any[] | undefined;
	}) => Promise<any>) | undefined;

	constructor(stakingCrypto: 'EL' | 'ELFI', library: providers.Web3Provider) {
		this.contract = new Contract(
			stakingCrypto === 'EL' ?
				envs.elStakingPoolAddress : envs.elfyStakingPoolAddress,
			StakingPoolAbi,
			getProviderOrSigner(library) as any
		)

		this.request = library.provider.request
	}

	async getUserReward(account: string, round: string): Promise<BigNumber> {
		return await this.contract.getUserReward(account, round) as BigNumber
	}

	async getPoolData(round: string): Promise<IPoolData> {
		return await this.contract.getPoolData(round) as IPoolData
	}

	async claim(account: string, round: string): Promise<string | undefined> {
		const { to, data } = await this.contract?.populateTransaction.claim(round);
		return this.sendTx(account, to, data);
	}

	async stake(account: string, amount: BigNumber): Promise<string | undefined> {
		const { to, data } = await this.contract?.populateTransaction.stake(amount);
		return this.sendTx(account, to, data);
	}

	async withdraw(account: string, amount: BigNumber, round: string): Promise<string | undefined> {
		const { to, data } = await this.contract?.populateTransaction.withdraw(amount, round);
		return this.sendTx(account, to, data);
	}

	async migrate(account: string, round: string): Promise<string | undefined> {
		const { to, data } = await this.contract?.populateTransaction.migrate(round);
		return this.sendTx(account, to, data)
	}

	private async sendTx(account: string, to: string | undefined, data: string | undefined): Promise<string | undefined> {
		if (!this.request) return;

		try {
			const txHash = await this.request({
				method: 'eth_sendTransaction',
				params: [
					{
						to,
						from: account,
						data,
					},
				],
			})

			return txHash;
		} catch (e) {
			console.log(e);
			return
		}
	}
}

export default StakingPool