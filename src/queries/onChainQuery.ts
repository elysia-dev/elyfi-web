export const onChainQuery = `
{
  proposals {
    status
    data {
      description
    }
    totalVotesCast
    totalVotesCastAgainst
    totalVotesCastInSupport
    totalVotesCastAbstained
    timestamp
    id
  }
}`;
