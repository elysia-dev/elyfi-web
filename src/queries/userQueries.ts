export const GET_USER = (id: string): string => `
 {
   user(id: "${id}") {
    id
    lTokenBalance {
      lToken {
        reserve {
          id
          depositAPY
        }
      }
      balance
    }
    isCouncil
    isCollateralServiceProvider
    deposit {
      id
      amount
      reserve {
        id
      }
    }
    withdraw {
      id
      amount
      reserve {
        id
      }
    }
    lTokenMint(orderBy: timestamp) {
      lToken {
        id
      }
      amount
      index
      timestamp
    }
    lTokenBurn(orderBy: timestamp) {
      lToken {
        id
      }
      amount
      index
      timestamp
    }
  }
}
`;
