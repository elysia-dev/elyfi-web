import { BigNumber } from 'ethers';
import { useState } from 'react'
import { formatComma } from 'src/utiles/formatters';

const WithdrawBody: React.FunctionComponent<{
	tokenName: string
	depositBalance: BigNumber
}> = ({ tokenName, depositBalance }) => {
	const [withdraw, setWithdraw] = useState<number>(0);

	const handler = (e: any) => {
		const { value } = e.target;
		(value < 0) ? setWithdraw(0) : setWithdraw(value)
	}

	return (
		<div className="modal__withdraw">
			<div className="modal__withdraw__value-wrapper">
				<p className="modal__withdraw__maximum bold">
					MAX
				</p>
				<p className="modal__withdraw__value bold">
					<input
						type="number"
						className="modal__text-input"
						placeholder="0"
						onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { ["-", "+", "e"].includes(e.key) && e.preventDefault() }}
						onChange={(e: React.ChangeEvent<HTMLDivElement>) => handler(e)}
					/>
				</p>
			</div>
			<div className="modal__withdraw__value-converter-wrapper">
			</div>
			<div className="modal__withdraw__withdrawalable">
				<div className="modal__withdraw__withdrawalable-amount-wrapper">
					<div className="modal__withdraw__withdrawalable__title">
						<p className="bold">Withdrawalable Amount</p>
						<p className="bold">{`${formatComma(depositBalance)} ${tokenName}`}</p>
					</div>
					<div>
						<p className="bold">Deposit Balance</p>
						<p className="bold">{`${formatComma(depositBalance)} ${tokenName}`}</p>
					</div>
					<div>
						<p className="bold">Total Balance in ELYFI</p>
						<p className="bold">1,000.00 {tokenName}</p>
					</div>
				</div>
				<div className="modal__withdraw__withdrawalable-value-wrapper">
					<div className="modal__withdraw__withdrawalable__title">
						<p className="bold">Accrual Interest</p>
					</div>
					<div>
						<p className="bold">Interest after the prior withdraw</p>
						<p className="bold">1,000.00 {tokenName}</p>
					</div>
					<div>
						<p className="bold">Accumulated Interest</p>
						<p className="bold">1,000.00 {tokenName}</p>
					</div>
				</div>
			</div>
			<div className={`modal__button${withdraw > 0 ? "" : "--disable"}`} onClick={() => console.log(withdraw)}>
				<p>
					{withdraw > 0 ? "WITHDRAW" : "NOT ENOUGH BALANCE TO WITHDRAW"}
				</p>
			</div>
		</div>
	)
}

export default WithdrawBody;
