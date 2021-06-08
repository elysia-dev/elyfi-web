import { useEffect, useState } from 'react'
import TokenContext, { initialTokenContext, ITokenContext } from '../contexts/TokenContext'
import AssetTypes from '../enums/AssetType';
import TokenTypes from '../enums/TokenType';
import Token000 from '../shared/images/tokens/el.png';
import Token001 from '../shared/images/tokens/eth.png';
import Token002 from '../shared/images/tokens/bnb.png';
import { TokenList } from '../types/TokenList';

const TokenProvider: React.FC = (props) => {
  const [state, setState] = useState<ITokenContext>(initialTokenContext);

  const stateSetting = () => {
    setState({
      ...state,
      tokenlist: [
        {
          tokenName: "ELA001",
          type: TokenTypes.ASSETS,
          image: AssetTypes.COMMERCIAL,
          marketSize: 564651234,
          totalBorrowed: 2323123321323423,
          depositApy: 29.2,
          borrowApr: 1.23
        },
        {
          tokenName: "ELA002",
          type: TokenTypes.ASSETS,
          image: AssetTypes.RESIDENTIAL,
          marketSize: 23123123123,
          totalBorrowed: 0,
          depositApy: 4.422,
          borrowApr: 20
        },
        {
          tokenName: "ELA003",
          type: TokenTypes.ASSETS,
          image: AssetTypes.COMMERCIAL,
          marketSize: 11123132213133,
          totalBorrowed: 23214123232,
          depositApy: 3.3,
          borrowApr: 44
        },
        {
          tokenName: "EL",
          type: TokenTypes.CRYPTO,
          image: Token000,
          marketSize: 312312233,
          totalBorrowed: 33121233,
          depositApy: 2.93,
          borrowApr: 192
        },
        {
          tokenName: "ETH",
          type: TokenTypes.CRYPTO,
          image: Token001,
          marketSize: 0,
        },
        {
          tokenName: "BNB",
          type: TokenTypes.CRYPTO,
          image: Token002,
          marketSize: 11323123213,
          totalBorrowed: 2212312312312,
          depositApy: 0.33,
          borrowApr: 0
        },
      ]
    })
  }

  const SortToken = async (key: "marketSize" | "totalBorrowed" | "depositApy" | "borrowApr" , ascending: boolean) => {
    return function (a: TokenList, b: TokenList) {
      if (a[key] === b[key]) {
        return 0;
      } else if (a[key] === null) {
        return 1;
      } else if (b[key] === null) {
        return -1;
      } else if (ascending) {
        return a[key]! < b[key]! ? -1 : 1;
      } else {
        return a[key]! < b[key]! ? 1 : -1;
      }
    }
  }
  const TokenReturn = async (key: "marketSize" | "totalBorrowed" | "depositApy" | "borrowApr", ascending: boolean, tokenType: TokenTypes) => {
    let arrayCopy: TokenList[] = state.tokenlist.filter((item) => {
      return item.type === tokenType
    });
    arrayCopy.sort(await SortToken(key, ascending))
    setState({
      ...state,
      tokenlist: arrayCopy
    })
  }
  useEffect(() => {
    stateSetting();
  } ,[])

  return (
    <TokenContext.Provider value={{
      ...state,
      TokenReturn
    }}>
      {props.children}
    </TokenContext.Provider>
  );
}

export default TokenProvider;