import { useEffect, useState } from 'react'
import TokenContext, { initialTokenContext, ITokenContext } from '../contexts/TokenContext'
import Token000 from '../shared/images/tokens/el.png';
import Token001 from '../shared/images/tokens/eth.png';
import Token002 from '../shared/images/tokens/bnb.png';

const TokenProvider: React.FC = (props) => {
  const [state, setState] = useState<ITokenContext>(initialTokenContext);

  const stateSetting = () => {
    setState({
      ...state,
      depositToken: [
        {
          tokenName: "BUSD",
          image: Token002,
          deposit: {
            balance: 664929430,
            apyRate: 3042,
            aprRate: 3529,
            total: 123941234
          }
        },
        {
          tokenName: "ETH",
          image: Token001,
          deposit: {
            balance: 23429430,
            apyRate: 42,
            aprRate: 29,
            total: 34122211234
          }
        }
      ],
      mintedToken: [
        {
          tokenName: "ELFI",
          image: Token000,
          minted: {
            elfi: 39204,
            walletBalance: 483822.3342
          }
        },
        {
          tokenName: "EL",
          image: Token000,
          minted: {
            elfi: 44243,
            walletBalance: 922
          }
        }
      ]
    })
  }

  // const SortToken = async (key: "marketSize" | "totalBorrowed" | "depositApy" | "borrowApr" , ascending: boolean) => {
  //   return function (a: TokenList, b: TokenList) {
  //     if (a[key] === b[key]) {
  //       return 0;
  //     } else if (a[key] === null) {
  //       return 1;
  //     } else if (b[key] === null) {
  //       return -1;
  //     } else if (ascending) {
  //       return a[key]! < b[key]! ? -1 : 1;
  //     } else {
  //       return a[key]! < b[key]! ? 1 : -1;
  //     }
  //   }
  // }
  // const TokenReturn = async (key: "marketSize" | "totalBorrowed" | "depositApy" | "borrowApr", ascending: boolean, tokenType: TokenTypes) => {
  //   let arrayCopy: TokenList[] = state.tokenlist.filter((item) => {
  //     return item.type === tokenType
  //   });
  //   arrayCopy.sort(await SortToken(key, ascending))
  //   setState({
  //     ...state,
  //     tokenlist: arrayCopy
  //   })
  // }
  useEffect(() => {
    stateSetting();
  } ,[])

  return (
    <TokenContext.Provider value={{
      ...state,
      // TokenReturn
    }}>
      {props.children}
    </TokenContext.Provider>
  );
}

export default TokenProvider;