import { BigNumber, utils } from 'ethers';
import { useState } from 'react'

const DepositBody: React.FunctionComponent<{
	tokenName: string,
	depositAPY: string,
	miningAPR: string,
	balance: BigNumber,
	isApproved: boolean,
	txWating: boolean,
	increaseAllownace: () => void,
}> = ({ tokenName, depositAPY, miningAPR, balance, isApproved, txWating, increaseAllownace }) => {
	const [deposit, setDeposit] = useState<number>(0);

	const handler = (e: any) => {
		const { value } = e.target;
		(value < 0) ? setDeposit(0) : setDeposit(value)
	}

	return (
		<div className="modal__deposit">
			<div className="modal__deposit__value-wrapper">
				<p className="modal__deposit__maximum bold">
					MAX
				</p>
				<p className="modal__deposit__value bold">
					<input
						type="number"
						className="modal__text-input"
						placeholder="0"
						onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { ["-", "+", "e"].includes(e.key) && e.preventDefault() }}
						onChange={(e: React.ChangeEvent<HTMLDivElement>) => handler(e)}
					/>
				</p>
			</div>
			<div className="modal__deposit__value-converter-wrapper">
			</div>
			<div className="modal__deposit__container">
				<div className="modal__deposit__despositable-amount-container">
					<p className="bold">
						Depositable Amount
					</p>
					<div className="modal__deposit__despositable-amount-wrapper">
						<p className="bold">
							Wallet Balance
						</p>
						<div className="modal__deposit__despositable-wallet-balance-wrapper">
							<p className="bold">
								{`${utils.formatEther(balance)} ${tokenName}`}
							</p>
						</div>
					</div>
				</div>
				<div className="modal__deposit__despositable-value-wrapper">
					<p className="bold">
						Deposit Rates
					</p>
					<div>
						<p className="bold">Deposit APY</p>
						<p className="bold">{depositAPY}</p>
					</div>
					<div>
						<p className="bold">Mining APR</p>
						<p className="bold">{miningAPR}</p>
					</div>
				</div>
			</div>
			{
				txWating ? <div className="modal__button">Wating...</div>
					: isApproved ?
						<div className={`modal__button${deposit > 0 ? "" : "--disable"}`} onClick={() => console.log(deposit)}>
							<p>
								{deposit > 0 ? "Deposit" : "NO FUNDS AVAILABLE"}
							</p>
						</div>
						:
						<div className="modal__button" onClick={() => increaseAllownace()}>
							<p>
								{`Allow the Elyfi Protocol to use your ${tokenName}`}
							</p>
						</div>
			}
		</div>
	)
}

export default DepositBody;