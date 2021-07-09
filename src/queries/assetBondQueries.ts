import { gql } from "@apollo/client";

export const GET_ALL_ASSET_BONDS = gql`
  query GetAllAssetBonds {
    assetBondTokens(orderBy: loanStartTimestamp, where: {state_gt: 2}) {
	    id,
	    state,
	    signer {
		    id,
      },
	    borrower {
	      id,
	    },
	    collateralServiceProvider {
	      id,
	    },
	    principal,
	    debtCeiling,
	    couponRate,
	    interestRate,
	    overdueInterestRate,
	    loanStartTimestamp,
	    collateralizeTimestamp,
	    maturityTimestamp,
	    liquidationTimestamp,
	    ipfsHash,
	    signerOpinionHash
    }
  }
`