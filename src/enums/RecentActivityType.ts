enum RecentActivityType {
	ELClaim = "elfi_claim_reward",
	ELFIClaim = 'dai_claim_reward',
  ELMigration = "el_elfi_transmission",
  ELFIMigration = "elfi_dai_transmission",
  Deposit = "dai_deposit",
  Withdraw = "dai_withdraw",
  Claim = "elfi_claim_reward",
  ELStakingWithdraw = "el_unstaking",
  ELFIStakingWithdraw = "elfi_unstaking",
  ELStake = "el_staking",
  ELFIStake = "elfi_staking",
  Idle = "activity"
}

export default RecentActivityType;