import { gql } from '@apollo/client';
import envs from 'src/core/envs';

const baseStage = envs.requiredNetwork === 'mainnet' ? 2 : 0;

export const GET_ALL_ASSET_BONDS = gql`
  query GetAllAssetBonds {
    assetBondTokens(
      orderBy: loanStartTimestamp
      orderDirection: desc
      where: { state_gt: ${baseStage} }
    ) {
      id
      state
      signer {
        id
      }
      borrower {
        id
      }
      collateralServiceProvider {
        id
      }
      reserve {
        id
      }
      principal
      debtCeiling
      couponRate
      interestRate
      delinquencyRate
      loanStartTimestamp
      collateralizeTimestamp
      maturityTimestamp
      liquidationTimestamp
      ipfsHash
      signerOpinionHash
    }
  }
`;
