// import { useTranslation } from 'react-i18next';
import { FunctionComponent, useEffect, useContext, useState } from 'react';
import { useLocation } from "react-router";
import { useHistory } from 'react-router-dom';
import Header from 'src/modules/pc/header/Header'
import Assets from 'src/types/Assets';
import AssetContext from 'src/contexts/AssetContext';
import ABToken from 'src/types/ABToken';
import returnTimpstamp from 'src/utiles/retrunTimestamp';
import { StaticGoogleMap, Marker, Path } from 'react-static-google-map';


const AssetDetail: FunctionComponent = () => {
  let history = useHistory();
  const location = useLocation<Assets>();
  const assets = location.state;
  // const { t } = useTranslation();
  const { getABToken } = useContext(AssetContext);
  const [state, setState] = useState<ABToken>();

  useEffect(() => {
    if (assets === undefined) {
      history.push('/');
      alert("잘못된 접근입니다.");
      return;
    }
    if (typeof getABToken(assets.abTokenId) === undefined) {
      history.push('/');
      alert("토큰 주소 오류입니다. 담당자에게 문의해주세요.");
      return;
    } else {
      setState(getABToken(assets.abTokenId))
    }
  }, [history, assets, getABToken])

  return (
    <section id="portfolio">
      <Header title="PORTFOLIO" />
      <div className="portfolio__info">
        <div className="portfolio__asset-list__title__wrapper" style={{ marginTop: 100 }}>
          <p className="portfolio__asset-list__title bold">Asset Detail</p>
          <hr className="portfolio__asset-list__title__line" />
        </div>
        <table className="portfolio__info__table">

          <tr>
            <td className="portfolio__info__table__title">
              <p>
                대출 번호
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {assets.loanNumber}
              </p>
            </td>
          </tr>

          <tr>
            <td className="portfolio__info__table__title">
              <p>
                대출 상태
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {assets.status}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                차입자
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {assets.collateral}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                차입자 주소
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {assets.collateralAddress}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                대출금 수취인
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {assets.borrower}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                대출금
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {assets.loan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {assets.method}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                대출 이자율 | 연체 이자율
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {assets.interest / 100}% | {assets.overdueInterest / 100}%
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                대출일
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {returnTimpstamp(assets.borrowingDate)}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                만기일
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {returnTimpstamp(assets.maturityDate)}
              </p>
            </td>
          </tr>
          <colgroup>
            <col style={{ width: 263 }} />
            <col style={{ width: 263 }} />
            <col style={{ width: "100%" }} />
          </colgroup>
          {state?.abTokenId === undefined ? (
            <>
              <td colSpan={3}
                style={{
                  borderTop: "1px solid #B7B7B7",
                  padding: 30,
                  textAlign: "center"
                }}>
                <p>
                  AB TOKEN 주소를 읽을 수 없습니다.
                </p>
              </td>
            </>
          ) : (
            <>
              <tr>
                <td rowSpan={9} className="portfolio__info__table__title--last">
                  <p>
                    담보물 정보
                  </p>
                </td>
                <td className="portfolio__info__table__title--second">
                  <p>
                    대출 상품
                  </p>
                </td>
                <td>
                  <p>
                    {state?.data.loanProducts}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title--second">
                  <p>
                    대출금
                  </p>
                </td>
                <td>
                  <p>
                    {state?.data.loan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title--second">
                  <p>
                    대출 이자율 | 연체 이자율
                  </p>
                </td>
                <td>
                  <p>
                    {(state?.data.interest === undefined) ? "" : state.data.interest / 100 + "% | "}{(state?.data.overdueInterest === undefined) ? "" : state.data.overdueInterest / 100 + "%"}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title--second">
                  <p>
                    대출일
                  </p>
                </td>
                <td>
                  <p>
                    {returnTimpstamp(state?.data.borrowingDate)}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title--second">
                  <p>
                    만기일
                  </p>
                </td>
                <td>
                  <p>
                    {returnTimpstamp(state?.data.maturityDate)}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title--second">
                  <p>
                    채권최고액
                  </p>
                </td>
                <td>
                  <p>
                    {state?.data.maximumBond.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title--second">
                  <p>
                    담보 유형
                  </p>
                </td>
                <td>
                  <p>
                    {state?.data.collateralType}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title--second">
                  <p>
                    담보물 주소
                  </p>
                </td>
                <td>
                  <p>
                    {state?.data.collateralAddress}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title--second">
                  <p>
                    계약서 이미지
                  </p>
                </td>
                <td>
                  <p>
                    {state?.data.contractImage}
                  </p>
                </td>
              </tr>
            </>
          )}
        </table>
      </div>
      {/* To do */}
      <StaticGoogleMap size="600x600" apiKey="AIzaSyDoZyTjSHKbfP217yeEvWZhuH8p9DGC9m8">
        <Marker
          location={{ lat: 40.737102, lng: -73.990318 }}
          color="blue"
          label="P"
        />
        <Path
          points={[
            '40.737102,-73.990318',
            '40.749825,-73.987963',
            '40.752946,-73.987384',
            '40.755823,-73.986397',
          ]}
        />
      </StaticGoogleMap>
    </section>
  );
}

export default AssetDetail;