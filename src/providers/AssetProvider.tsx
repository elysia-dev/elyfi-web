import { useEffect, useState } from 'react'
import AssetContext, { initialAssetContext, IAssetContext } from '../contexts/AssetContext'
import AssetStatus from '../enums/AssetStatus';
import TokenTypes from '../enums/TokenType';
import ABToken from '../types/ABToken';

const AssetProvider: React.FC = (props) => {
  const [state, setState] = useState<IAssetContext>(initialAssetContext);
  // to do: 구글 api 빨리가져오기
  const initialAssets = () => {
    setState({
      ...state,
      assets: [
        {
          loanNumber: 1,
          status: AssetStatus.Repaid,
          collateral: "차입자 회사명",
          collateralAddress: "110-390-156059 신한",
          borrower: "110-390-156059 빌란사람 계좌",
          loan: 1000000,
          method: TokenTypes.BUSD,
          interest: 1234,
          overdueInterest: 4567,
          borrowingDate: 1607110465663,
          maturityDate: 1623906828465,
          abTokenId: "0x123456789a",
          map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.2682992854884!2d127.0248853148802!3d37.501589735603424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca158643aa479%3A0x53843ee59beac03c!2z7ISc7Jq47Yq567OE7IucIOqwleuCqOq1rCDsl63sgrzrj5kg6rCV64Ko64yA66GcMTAw6ri4IDE0!5e0!3m2!1sko!2skr!4v1623842880474!5m2!1sko!2skr"
        },
        {
          loanNumber: 2,
          status: AssetStatus.Liquidation,
          collateral: "차입자 회사명2",
          collateralAddress: "110-390-156059 신한",
          borrower: "110-390-156059 빌란사람 계좌",
          loan: 500,
          method: TokenTypes.ETH,
          interest: 10000,
          overdueInterest: 800,
          borrowingDate: 1607110465663,
          maturityDate: 1633906828465,
          abTokenId: "0x123456789b",
          map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1650362.9293174!2d125.97519983125!3d36.10896210000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35700fe4cf1665eb%3A0xc797b6f3d2b5f370!2z7Jyh6rWw7ZuI66Co7IaMIOyeheyGjOuMgA!5e0!3m2!1sko!2skr!4v1624014974930!5m2!1sko!2skr"
        },
        {
          loanNumber: 3,
          status: AssetStatus.Completed,
          collateral: "차입자 회사명3",
          collateralAddress: "110-390-156059 신한",
          borrower: "110-390-156059 빌란사람 계좌",
          loan: 300000000,
          method: TokenTypes.EL,
          interest: 5678,
          overdueInterest: 800,
          borrowingDate: 1507110465663,
          maturityDate: 1673982671403,
          abTokenId: "0x123456789c",
          map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.9539463521005!2d126.64558111501202!3d37.36726657983564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b77a8d638d103%3A0x9a447e91aeb15dc5!2z7Iqk66eI7Yq467C466asIETrj5k!5e0!3m2!1sko!2skr!4v1624015090084!5m2!1sko!2skr"
        },
        {
          loanNumber: 4,
          status: AssetStatus.Repaid,
          collateral: "abtoken 못 찾는 회사",
          collateralAddress: "110-390-156059 신한",
          borrower: "110-390-156059 빌란사람 계좌",
          loan: 3000,
          method: TokenTypes.EL,
          interest: 5678,
          overdueInterest: 800,
          borrowingDate: 1507110465663,
          maturityDate: 1673982671403,
          abTokenId: "0x123456789d",
          map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44763.25505621444!2d-71.02032072224554!3d25.00426983967512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89451ab5034cb7ab%3A0xb600ecf3df7aca4d!2z67KE666k64ukIOyCvOqwgeyngOuMgA!5e1!3m2!1sko!2skr!4v1624015347500!5m2!1sko!2skr"
        },
      ],
      abToken: [
        {
          abTokenId: "0x123456789a",
          collateralAddress: "110-390-156059 신한",
          data: {
            loanProducts: "대출 상품 이름 뭐로",
            loan: 14000,
            interest: 1234,
            overdueInterest: 4567,
            borrowingDate: 1607110465663,
            maturityDate: 1623906828465,
            maximumBond: 100000000,
            collateralType: "collateralType",
            collateralAddress: "서울특별시 강남대로 100길 14",
            contractImage: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.2682992854884!2d127.0248853148802!3d37.501589735603424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca158643aa479%3A0x53843ee59beac03c!2z7ISc7Jq47Yq567OE7IucIOqwleuCqOq1rCDsl63sgrzrj5kg6rCV64Ko64yA66GcMTAw6ri4IDE0!5e0!3m2!1sko!2skr!4v1623842880474!5m2!1sko!2skr"
          }
        },
        {
          abTokenId: "0x123456789b",
          collateralAddress: "110-390-156059 신한",
          data: {
            loanProducts: "대출 상품 이름 뭐로",
            loan: 14000,
            interest: 1234,
            overdueInterest: 4567,
            borrowingDate: 1607110465663,
            maturityDate: 1623906828465,
            maximumBond: 100000000,
            collateralType: "collateralType",
            collateralAddress: "서울특별시 강남대로 100길 14",
            contractImage: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.2682992854884!2d127.0248853148802!3d37.501589735603424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca158643aa479%3A0x53843ee59beac03c!2z7ISc7Jq47Yq567OE7IucIOqwleuCqOq1rCDsl63sgrzrj5kg6rCV64Ko64yA66GcMTAw6ri4IDE0!5e0!3m2!1sko!2skr!4v1623842880474!5m2!1sko!2skr"
          }
        },
        {
          abTokenId: "0x123456789c",
          collateralAddress: "110-390-156059 신한",
          data: {
            loanProducts: "대출 상품 이름 뭐로",
            loan: 14000,
            interest: 1234,
            overdueInterest: 4567,
            borrowingDate: 1607110465663,
            maturityDate: 1623906828465,
            maximumBond: 100000000,
            collateralType: "collateralType",
            collateralAddress: "서울특별시 강남대로 100길 14",
            contractImage: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.2682992854884!2d127.0248853148802!3d37.501589735603424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca158643aa479%3A0x53843ee59beac03c!2z7ISc7Jq47Yq567OE7IucIOqwleuCqOq1rCDsl63sgrzrj5kg6rCV64Ko64yA66GcMTAw6ri4IDE0!5e0!3m2!1sko!2skr!4v1623842880474!5m2!1sko!2skr"
          }
        },
      ]
    })
  }

  
  
  const getABToken = (abTokenId: string) => { 
    const result = state.abToken.find((token) => { return token.abTokenId === abTokenId })
    return result;
  }

  useEffect(() => {
    initialAssets();
  } ,[])

  return (
    <AssetContext.Provider value={{
      ...state,
      getABToken
    }}>
      {props.children}
    </AssetContext.Provider>
  );
}

export default AssetProvider;