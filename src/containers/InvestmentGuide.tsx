import Header from "src/components/Header";
import Guide01 from "src/assets/images/guide/01.png";
import Guide02 from "src/assets/images/guide/02.png";
import Guide03 from "src/assets/images/guide/03.png";
import Guide04 from "src/assets/images/guide/04.png";
import Guide05 from "src/assets/images/guide/05.png";
import { useState } from "react";
import { faucetTestERC20 } from 'src/utiles/contractHelpers';
import { useWeb3React } from '@web3-react/core';
import envs from 'src/core/envs';
import { useTranslation } from "react-i18next";
import LanguageType from "src/enums/LanguageType";

const InvestmentGuide = () => {
  const [onClick, setClick] = useState(0);
  const { account, chainId, library } = useWeb3React();
  const ClickHandler = (no: number) => {
    setClick(onClick === no ? 0 : no);
  }
  const { i18n } = useTranslation();
  const AddressCopy = (add: string) => {
    if (!document.queryCommandSupported("copy")) {
      return alert("This browser does not support the copy function.");
    }
    const area = document.createElement('textarea');
    area.value = add;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    alert("Copied!!");
  }

  const EngGuide = () => {
    return (
      <section className="guide">
        <p className="guide__alert bold">
          Please be advised that this guide is for ELYFI beta on the {envs.requiredNetwork} network only, and may differ from ELYFI V1<br />
        </p>
        <div className="bounty__title">
          <p className="bold">ELYFI Platform Manual</p>
          <hr />
        </div>
        <div>
          <div className="guide__connect-wallet">
            <h3>Connect wallet</h3>
            <ol>
              <li>
                <p>
                  You will need to have Metamask. Install Metmask&nbsp;
                  <a className="guide__link" href={"https://metamask.io/download.html"} target="_blank">here</a>.
                </p>
              </li>
              <li>
                <p>
                  After you have created a wallet on Metmask, change the network from Ethereum Mainnet to {envs.requiredNetwork} Test Network.
                </p>
                <img
                  className="guide__image"
                  src={Guide01}
                  alt="Guide"
                  style={{ width: onClick === 1 ? "100%" : 300 }}
                  onClick={() => { ClickHandler(1) }}
                />
              </li>
              <li>
                <p>
                  Click&nbsp;
                  <span
                    style={{
                      color: "#00A7FF",
                      textDecoration: "underline",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      if (account && chainId === envs.requiredChainId) {
                        faucetTestERC20(account, library)
                      } else {
                        alert(`Please connet to the ${envs.requiredNetwork} network`)
                      }
                    }}
                  >
                    here
                  </span> to use Metamask Faucet so you can review free test tokens. Keep in mind that you must be connected to the {envs.requiredNetwork} network.<br/>
                  Also, to receive {envs.requiredNetwork} ETH for the test, click <a className="guide__link" href={"https://faucet.ropsten.be/"} target="_blank">here</a> and enter the wallet address you created above.
                </p>
              </li>
              <li>
                <p>
                  Click add tokens on Metamask, and enter the address below and click next<br />
                  Contract Address : <span style={{ color: "#00A7FF", cursor: "pointer" }} onClick={() => AddressCopy(envs.testStableAddress)}>{envs.testStableAddress}</span>
                </p>
              </li>
            </ol>
            <br />
            <p>
              Your are ready to test!
            </p>
          </div>
          <div className="guide__connect-page">
            <h3>Connect wallet to ELYFI</h3>
            <ol>
              <li>
                <p>
                  First, click on the ‘Connect Wallet’ button on the top right corner. Find your Metamask notification pop-up to complete
                </p>
                <img
                  className="guide__image"
                  src={Guide02}
                  alt="Guide"
                  style={{ width: onClick === 2 ? "100%" : 300 }}
                  onClick={() => { ClickHandler(2) }}
                />
              </li>
              <li>
                <p>
                You will be able to find the deposit token list on your dashboard By clicking on the token received from Faucet, you may use the tokens to make deposits on the money pool or make withdrawals
                </p>
              </li>
            </ol>
          </div>
          <div className="guide__deposit">
            <h3>Making Deposits</h3>
            <ol>
              <li>
                <p>
                  Click on the token you want to deposit from the dashboard and enter amount.
                </p>
              </li>
              <li>
                <p>
                  Click on the DEPOSIT button in which a Metmask notification will show to confirm the transaction.
                </p>
                <img
                  className="guide__image"
                  src={Guide03}
                  alt="Guide"
                  style={{ width: onClick === 3 ? "100%" : 300 }}
                  onClick={() => { ClickHandler(3) }}
                />
              </li>
              <li>
                <p>
                  After the transaction has been approved, please check the deposit balance, wallet balance, and money pool size.
                </p>
              </li>
            </ol>
          </div>
          <div className="guide__withdraw">
            <h3>Making Withdrawals</h3>
            <ol>
              <li>
                <p>
                  You must first have deposits in the money pool. Please find the deposit guide above.
                </p>
              </li>
              <li>
                <p>
                  Check the numbers on ‘Withdraw Available’ and enter the amount you would like to withdraw.
                </p>
              </li>
              <li>
                <p>
                  By clicking the WITHDRAW button you will see a Metamask notification to confirm the transaction request.
                </p>
              </li>
              <li>
                <p>
                  After it is approved, please check the deposit balance, wallet balance, and money pool size.
                </p>
              </li>
            </ol>
          </div>
          <div className="guide__minted-token">
            <h3>ELFI Withdrawals</h3>
            <ol>
              <li>
                <p>
                  First, Go to your Metmask, click Add Token and enter the following Token Contract Address.<br />
                  Contract Address : <span style={{ color: "#00A7FF", cursor: "pointer" }} onClick={() => AddressCopy(envs.governanceAddress)}>{envs.governanceAddress}</span>
                </p>
              </li>
              <li>
                <p>
                  Check the minted ELFI on your dashboard. If you have deposits in the money pool, you will be able to mine ELFI and see the changes in real-time.
                </p>
                <img
                  className="guide__image"
                  src={Guide04}
                  alt="Guide"
                  style={{ width: onClick === 4 ? "100%" : 300 }}
                  onClick={() => { ClickHandler(4) }}
                />
              </li>
              <li>
                <p>
                  Click ELFI and complete withdrawals. Please check if ELFI has been sent to your address.
                </p>
                <img
                  className="guide__image"
                  src={Guide05}
                  alt="Guide"
                  style={{ width: onClick === 5 ? "100%" : 300 }}
                  onClick={() => { ClickHandler(5) }}
                />
              </li>
            </ol>
          </div>
        </div>
      </section>
    )
  }

  const KorGuide = () => {
    return (
      <section className="guide">
        <p className="guide__alert bold">
          해당 메뉴얼은 ELYFI beta version의 {envs.requiredNetwork} network 기반 투자 메뉴얼이며,<br />
          실제로 정식 ELYFI 출시시 해당 문서와 사용 방식에서 차이점이 있을 수 있다는 점을 미리 안내드립니다.
        </p>
        <div className="bounty__title">
          <p className="bold">ELYFI Platform Manual</p>
          <hr />
        </div>
        <div>
          <div className="guide__connect-wallet">
            <h3>지갑 연결하기</h3>
            <ol>
              <li>
                <p>
                  먼저 서비스를 이용하시기 위해서는 반드시 Metamask가 필요합니다.&nbsp;
                  <a className="guide__link" href={"https://metamask.io/download.html"} target="_blank">이 곳</a>에서 메타마스크를 설치해주세요.
                </p>
              </li>
              <li>
                <p>
                  Metamask를 이용해 지갑주소를 생성하신 뒤, Metamask에서 Ethereum Mainnet을 {envs.requiredNetwork} Test Network로 변경해주세요.
                </p>
                <img
                  className="guide__image"
                  src={Guide01}
                  alt="Guide"
                  style={{ width: onClick === 1 ? "100%" : 300 }}
                  onClick={() => { ClickHandler(1) }}
                />
              </li>
              <li>
                <p>
                  <span
                    style={{
                      color: "#00A7FF",
                      textDecoration: "underline",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      if (account && chainId === envs.requiredChainId) {
                        faucetTestERC20(account, library)
                      } else {
                        alert(`Please connet to the ${envs.requiredNetwork} network`)
                      }
                    }}
                  >
                    이 곳
                  </span>
                  을 클릭해 Faucet 과정을 진행해주세요. 무료로 지갑주소에 테스트 토큰을 발급 받으실 수 있습니다. 단, 반드시 {envs.requiredNetwork} network에 연결되어 있어야 합니다.<br/>
                  또한, 테스트 진행을 위한 {envs.requiredNetwork} ETH를 지급받기 위해서 <a className="guide__link" href={"https://faucet.ropsten.be/"} target="_blank">이 곳</a>을 클릭 후 발급 받으신 지갑주소를 입력해주세요.
                </p>
              </li>
              <li>
                <p>
                  Metamask에서 토큰 추가 버튼을 클릭하신 뒤 토큰 계약 주소란에 아래 주소를 입력해주신 뒤 확인을 눌러주세요.<br />
                  Contract Address : <span style={{ color: "#00A7FF", cursor: "pointer" }} onClick={() => AddressCopy(envs.testStableAddress)}>{envs.testStableAddress}</span>
                </p>
              </li>
            </ol>
            <br />
            <p>
              이로써 테스트를 위한 지갑 준비는 완료되었습니다.
            </p>
          </div>
          <div className="guide__connect-page">
            <h3>지갑을 ELYFI로 연결하기</h3>
            <ol>
              <li>
                <p>
                  먼저, 상단 네비게이션 및 대시보드에서 Connect Wallet을 클릭하신 뒤, 지갑연결을 진행해주세요.<br />
                  버튼 클릭시 팝업으로 출력되는 Metamask Notification에서 지갑 연결을 진행할 수 있습니다.
                </p>
                <img
                  className="guide__image"
                  src={Guide02}
                  alt="Guide"
                  style={{ width: onClick === 2 ? "100%" : 300 }}
                  onClick={() => { ClickHandler(2) }}
                />
              </li>
              <li>
                <p>
                  연결 후 Dashboard로 접근해주시면 Deposit token List를 확인하실 수 있습니다.<br />
                  Faucet으로 지갑에 발급받으신 토큰을 클릭하시면 머니풀에 직접 예치하거나, 이전에 예치했던 금액을 출금할 수 있습니다.
                </p>
              </li>
            </ol>
          </div>
          <div className="guide__deposit">
            <h3>예치하는 방법</h3>
            <ol>
              <li>
                <p>
                  먼저 Dashboard에서 예치를 원하는 토큰을 클릭 후 팝업창을 실행시킨 뒤, 예치할 금액을 입력하세요.
                </p>
              </li>
              <li>
                <p>
                  그 후 DEPOSIT Button을 클릭하시면 Metamask Notification이 출력되는데, 트랜잭션 내역을 다시 한 번 검토해주신 뒤 승인을 진행해 주세요.
                </p>
                <img
                  className="guide__image"
                  src={Guide03}
                  alt="Guide"
                  style={{ width: onClick === 3 ? "100%" : 300 }}
                  onClick={() => { ClickHandler(3) }}
                />
              </li>
              <li>
                <p>
                  승인 후 Deposit Balance 및 Wallet Balance, 그리고 머니풀 사이즈를 확인해주시면 됩니다.
                </p>
              </li>
            </ol>
          </div>
          <div className="guide__withdraw">
            <h3>출금하는 방법</h3>
            <ol>
              <li>
                <p>
                  먼저, 예치하셨던 금액이 머니풀에 존재해야 합니다. 위에 예치과정을 먼저 진행해주시는것을 권장합니다.
                </p>
              </li>
              <li>
                <p>
                  Withdraw Available의 수량을 확인하시고 출금할 금액을 입력해주세요.
                </p>
              </li>
              <li>
                <p>
                  그 후 WITHDRAW Button을 클릭하시면 Metamask Notification이 출력되는데, 트랜잭션 내역을 다시 한 번 검토해주신 뒤 승인을 진행해 주세요.
                </p>
              </li>
              <li>
                <p>
                  승인 후 Deposit Balance 및 Wallet Balance, 그리고 머니풀 사이즈를 확인해주시면 됩니다.
                </p>
              </li>
            </ol>
          </div>
          <div className="guide__minted-token">
            <h3>ELFI 채굴 출금하기</h3>
            <ol>
              <li>
                <p>
                  먼저, Metamask로 접근하신 뒤 토큰 추가 버튼을 클릭하신 후 토큰 계약 주소란에 아래 주소를 입력해주신 뒤 확인을 눌러주세요.<br />
                  Contract Address : <span style={{ color: "#00A7FF", cursor: "pointer" }} onClick={() => AddressCopy(envs.governanceAddress)}>{envs.governanceAddress}</span>
                </p>
              </li>
              <li>
                <p>
                  이 후, Dashboard 아래에서 Minted된 ELFI를 확인합니다. 머니풀에 자산을 예치하면, ELFI를 채굴하실 수 있으며, 실시간으로 적립되는것을 확인할 수 있습니다.
                </p>
                <img
                  className="guide__image"
                  src={Guide04}
                  alt="Guide"
                  style={{ width: onClick === 4 ? "100%" : 300 }}
                  onClick={() => { ClickHandler(4) }}
                />
              </li>
              <li>
                <p>
                  ELFI를 클릭 후, 팝업창을 띄우고 출금을 진행합니다. 출금 후 지갑주소에 ELFI가 제대로 전송이 됐는지 확인하시면 됩니다.
                </p>
                <img
                  className="guide__image"
                  src={Guide05}
                  alt="Guide"
                  style={{ width: onClick === 5 ? "100%" : 300 }}
                  onClick={() => { ClickHandler(5) }}
                />
              </li>
            </ol>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <>
      <Header title={"INVESTMENT GUIDE"} />
      {i18n.language === LanguageType.KO ? KorGuide() : EngGuide()}
    </>
  )
}

export default InvestmentGuide;