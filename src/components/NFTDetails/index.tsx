import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import useNavigator from 'src/hooks/useNavigator';
import DrawWave from 'src/utiles/drawWave';
import Questionmark from 'src/components/Questionmark';
import ContractImage from 'src/assets/images/market/contract.gif';
import Clip from 'src/assets/images/market/clip.svg';
import NFTStructure from 'src/assets/images/market/NFTStructure.png';
import BondAsset from 'src/assets/images/market/bondAssets.png';
import MainnetType from 'src/enums/MainnetType';
import ChangeNetworkModal from '../Market/Modals/ChangeNetworkModal';
import ReconnectWallet from '../Market/Modals/ReconnectWallet';
import NFTPurchaseModal from '../Market/Modals/NFTPurchaseModal';

const NFTDetails = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
  const { t } = useTranslation();
  const navigate = useNavigator();
  const { lng } = useParams<{ lng: string }>();

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY = headerRef.current.offsetTop + 80;
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height / dpr;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);
    if (mediaQuery === MediaQuery.Mobile) return;
    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.ELFI,
      browserHeight,
      true,
    );
  };

  useEffect(() => {
    draw();
    window.addEventListener('scroll', () => draw());
    window.addEventListener('resize', () => draw());

    return () => {
      window.removeEventListener('scroll', () => draw());
      window.removeEventListener('resize', () => draw());
    };
  }, [document.body.clientHeight]);

  return (
    <>
      {/* <ChangeNetworkModal network={MainnetType.Ethereum} /> */}
      {/* <ReconnectWallet /> */}
      {/* <NFTPurchaseModal /> */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <main className="nft-details">
        <div className="component__text-navigation">
          <p onClick={() => navigate(`/${lng}/market`)} className="pointer">
            마켓
          </p>
          &nbsp;&gt;&nbsp;
          <p>채권 NFT</p>
        </div>
        <article className="nft-details__header">
          <div>
            <h1>채권 NFT</h1>
            <p>
              채권 NFT를 구매하고 채권만기일에 원금과 이자를 받아갈 수 있어요!
            </p>
          </div>
          <section>
            <div>
              <b>
                나의 구매수량
                <span>
                  <Questionmark content={'123213'} />
                </span>
              </b>
              <button>구매하기</button>
            </div>
            <b>아직 구매한 수량이 없습니다</b>
          </section>
        </article>
        <article className="nft-details__content">
          <article className="nft-details__purchase">
            <section className="nft-details__purchase__status">
              <h2>구매현황</h2>
              <div>
                <div>
                  <p>구매한 NFTs</p>
                  <p>총 NFTs</p>
                </div>
                <div>
                  <b>0</b>
                  <b>54,000</b>
                </div>
                <progress value={5000} max={54000} />
                <p>(* 1NFT = $10)</p>
              </div>
            </section>
            <section className="nft-details__purchase__round">
              <h2>구매기간</h2>
              <div>
                <div>
                  <b>07</b>
                  <p>일</p>
                </div>
                <b>:</b>
                <div>
                  <b>05</b>
                  <p>시간</p>
                </div>
                <b>:</b>
                <div>
                  <b>42</b>
                  <p>분</p>
                </div>
                <b>:</b>
                <div>
                  <b>21</b>
                  <p>초</p>
                </div>
              </div>
              <p>2022. 7. 18 ~ 2022.8.1 KST</p>
            </section>
          </article>
          <article className="nft-details__nft-info">
            <h2>NFT 정보</h2>
            <div>
              <figure>
                <img src={ContractImage} alt="Contract image" />
              </figure>
              <table>
                <tr>
                  <th>NFT명</th>
                  <td colSpan={3}>채권 NFT</td>
                </tr>
                <tr>
                  <th>NFT 설명</th>
                  <td colSpan={3}>
                    채권에 대한 소유권
                    <ul>
                      <li>
                        채권 NFT 소유자는 채권만기일에 엘리파이 사이트에서
                        원금과 이자를 수령할 수 있습니다.
                      </li>
                      <li>
                        예상 이자 수익은 대출실행일부터 채권만기일까지 발생
                        합니다.
                      </li>
                      <li>
                        자세한 상품정보는 엘리파이 사이트에서 확인할 수
                        있습니다.
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th>원금</th>
                  <td>$ 10</td>
                  <th>예상 이자 수익</th>
                  <td>$ 0.3</td>
                </tr>
                <tr>
                  <th>연 수익률</th>
                  <td>12%</td>
                  <th>연체이자율</th>
                  <td>15%</td>
                </tr>
                <tr>
                  <th>대출실행일</th>
                  <td colSpan={3}>2022.8.1 KST</td>
                </tr>
                <tr>
                  <th>채권만기일</th>
                  <td colSpan={3}>2022.11.30 KST</td>
                </tr>
                <tr>
                  <th>담보물 정보</th>
                  <td colSpan={3}>
                    <div>
                      <a>
                        <img src={Clip} />
                        대부계약서
                      </a>
                      <a>
                        <img src={Clip} />
                        질권설정계약서
                      </a>
                      <a>
                        <img src={Clip} />
                        공정증서
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </article>
          <article className="nft-details__bond-nft">
            <h2>채권 NFT 구조</h2>
            <table>
              <tr>
                <td colSpan={2} className="image-wrapper">
                  <img src={NFTStructure} />
                </td>
              </tr>
              <tr>
                <th>1. 채권 NFT 구매</th>
                <td>구매자가 엘리파이에서 채권 NFT를 구매한다.</td>
              </tr>
              <tr>
                <th>2. 대출채권 담보 및 가상화폐 대출</th>
                <td>
                  차입자는 엘리파이에서 가상화폐를 대출 받기 위해 대출채권을
                  담보물로 설정합니다. 이와 동시에 엘리파이는 차입자의 지갑으로
                  가상화폐를 전송합니다.
                </td>
              </tr>
              <tr>
                <th>3. 원리금 상환</th>
                <td>차입자는 상환 기간에 맞춰 원금과 이자를 상환합니다.</td>
              </tr>
              <tr>
                <th>4. 수익 실현</th>
                <td>
                  NFT 구매자는 채권만기일에 채권 NFT로 수익금을 수령하고, 해당
                  NFT는 자동으로 소각됩니다.
                </td>
              </tr>
            </table>
          </article>
          <article className="nft-details__borrower">
            <h2>차입자 정보</h2>
            <table>
              <tr>
                <th>법인명</th>
                <td>(주)엘리파이대부</td>
              </tr>
              <tr>
                <th>법인등록번호</th>
                <td>220111-0189192</td>
              </tr>
              <tr>
                <th>체납세금</th>
                <td>해당없음</td>
              </tr>
              <tr>
                <th>채무불이행</th>
                <td>해당없음</td>
              </tr>
              <tr>
                <th>법인등기부등본</th>
                <td>
                  <div>
                    <a>
                      <img src={Clip} />
                      등기부등본 사본
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </article>
          <article className="nft-details__real-estate-info">
            <h2>미국부동산 정보</h2>
            <div>
              <figure>
                <img src={BondAsset} alt="Bond Asset" />
              </figure>
              <section>
                <b>Norwalk Ave</b>
                <table>
                  <tr>
                    <th>위치</th>
                    <td>2046 Norwalk Ave, LA, CA 90041</td>
                  </tr>
                  <tr>
                    <th>대지/건축면적</th>
                    <td>6,214 sqft / 1,034 + 350 sqft</td>
                  </tr>
                  <tr>
                    <th>주택 유형</th>
                    <td>단독 주택</td>
                  </tr>
                  <tr>
                    <th>지역 특징</th>
                    <td>
                      Eagle Rock은 Occidental College가 위치해 있는 지역으로
                      근처에 상업거리인 Colorado Blvd가 인접 하여 좋은 입지를
                      가지고 있습니다.
                    </td>
                  </tr>
                </table>
              </section>
            </div>
          </article>
        </article>
        <article className="nft-details__terms">
          <b>꼭! 확인해주세요</b>
          <ul>
            <li>
              ELYFI는 해당 사이트에 올라온 어떤 자산에 대해서도 투자 조언, 투자
              권유를 하지 않습니다.
            </li>
            <li>
              본 상품은 구매자들이 ELYFI를 통해 채권 NFT를 구매하여 모집된
              금액으로 차입자가 가상화폐를 대출받는 형태입니다.
            </li>
            <li>
              본 상품을 구매할 경우 구매 취소가 불가능합니다. 다만, NFT
              마켓플레이스인 오픈씨에서 보유하신 채권 NFT를 판매할 수 있습니다.
            </li>
            <li>
              구매 기간 후 대출을 실행하며, 대출이 실행 되지 않을 경우 즉시 구매
              원금을 직접 가상화폐로 받아갈 수 있습니다.
            </li>
            <li>본 상품은 원금 및 수익률이 보장되지 않습니다.</li>
            <li>
              차입자의 자금 상황에 따라 만기일 전에 중도 상환될 수 있으며, 상환
              당일 또는 다음 날(영업일 기준)에 원리금을 수령할 수 있습니다.
            </li>
            <li>
              연체가 발생할 경우, 기존 대출금리에 연체가산이자율(3%)를 합산하여
              최대 연 20%(법정최고금리) 이내 수취합니다.
            </li>
            <li>
              엘리파이에서 제공하는 정보를 확인한 후 채권 NFT를 구매하시기
              바랍니다.
            </li>
          </ul>
        </article>
      </main>
    </>
  );
};

export default NFTDetails;
