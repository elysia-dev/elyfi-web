import { gql } from "@apollo/client";

// id is lower address
export const GET_USER = gql`
  query GetUser($id: String!) {
	  user (id: $id) {
      id,
      lTokenBalance {
        lToken {
          reserve {
            id,
            depositAPY,
          }
        },
        balance
      },
      isCouncil,
      isCollateralServiceProvider,
      deposit {
        id,
        amount,
        reserve {
          id
        }
      },
      withdraw {
        id,
        amount,
        reserve {
          id
        }
      },
    }
  }
`;