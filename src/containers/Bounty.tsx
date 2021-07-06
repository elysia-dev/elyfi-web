import Header from "src/components/Header";
import { useTranslation } from "react-i18next";
import LanguageType from "src/enums/LanguageType";

const Bounty = () => {
  const { i18n } = useTranslation();
  
  return (
    <>
      <Header title={"BUG BOUNTY"} />
      {i18n.language === LanguageType.KO ? KorNotice() : EngNotice()}
    </>
  )
}

const KorNotice = () => {
  return (
    <section className="bounty">
      <div className="bounty__title">
        <p className="bold">버그 바운티</p>
        <hr />
      </div>
      <div className="bounty__notice">
        <p>엘리시아 개발팀은 엘리시아 서비스의 품질을 높이기 위해 최선을 다하고 있습니다.</p>
        <p>엘리시아 생태계 참여자분들이 주시는 버그 리포팅 또는 좋은 제안은 서비스 품질을 높이는데 크게 도움이 되어 매우 감사함을 느끼고 있습니다.</p>
        <p>이에 따라 버그리포팅이나 제안하는 분들에게 보상을 드릴 수 있도록 보상 체계를 마련했습니다.</p>
        <p>특별한 양식은 없으며, 모든 제안 또는 보고는 support@elysia.land이나, <a href={"https://elysia.land"} target="_blank:" className="bounty__link">https://elysia.land</a>의 contact에 제출해주시면 됩니다.</p>
      </div>
      <div>
        <div className="bounty__title">
          <p className="bold">제보 현상금</p>
          <hr />
        </div>
        <table className="bounty__table">
          <tr>
            <td rowSpan={6}>
              <p>
                버그의 가능성
              </p>
            </td>
            <td>
              <p>
                거의 확실
              </p>
            </td>
            <td>
              <p>
                $2,500
              </p>
            </td>
            <td>
              <p>
                $10,000
              </p>
            </td>
            <td>
              <p>
                $30,000
              </p>
            </td>
            <td>
              <p>
                $100,000
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                가능성 있는
              </p>
            </td>
            <td>
              <p>
                $1,000
              </p>
            </td>
            <td>
              <p>
                $2,500
              </p>
            </td>
            <td>
              <p>
                $10,000
              </p>
            </td>
            <td>
              <p>
                $30,000
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                가능
              </p>
            </td>
            <td>
              <p>
                $250
              </p>
            </td>
            <td>
              <p>
                $1,000
              </p>
            </td>
            <td>
              <p>
                $2,500
              </p>
            </td>
            <td>
              <p>
                $10,000
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                가능성 낮은
              </p>
            </td>
            <td>
              <p>
                $100
              </p>
            </td>
            <td>
              <p>
                $250
              </p>
            </td>
            <td>
              <p>
                $1,000
              </p>
            </td>
            <td>
              <p>
                $2,500
              </p>
            </td>
          </tr>
          <tr>
            <td className="bounty__table__line">
            </td>
            <td>
              <p>
                낮은
              </p>
            </td>
            <td>
              <p>
                보통
              </p>
            </td>
            <td>
              <p>
                높은
              </p>
            </td>
            <td>
              <p>
                심각
              </p>
            </td>
          </tr>
          <tr>
            <td colSpan={5} style={{ textAlign: "center" }}>
              <p>
                버그의 심각성
              </p>  
            </td>
          </tr>
        </table>
      </div>
      <div>
        <ul>
          <li>
            <p>세로축은 버그의 가능성이며, 가로축은 심각성입니다.</p>
          </li>
          <li>
            <p>
              발견한 버그를 공개하면 보상을 받을 수 없습니다.
            </p>
          </li>
          <li>
            <p>
              중복된 문제로 보상을 받을 수 없습니다.
            </p>
          </li>
          <li>
            <p>
              보상은 사례별로 결정되며, 엘리시아의 단독 재량으로 결정합니다.
            </p>
          </li>
          <li>
            <p>
              보상 체계는 시간이 지남에 따라 달라질 수 있습니다.
            </p>
          </li>
          <li>
            <p>
              문제의 심각성과 가능성은 OWASP 위험 등급 모델에 따라 결정합니다.
            </p>
          </li>
          <li>
            <p>
              문제파악에 도움이 되도록 스크린샷이나 영상을 포함시켜주세요.
            </p>
          </li>
          <li>
            <p>
              모든 보상금은 보상금에 해당하는 달러 가치 만큼의 EL로 지급됩니다.
            </p>
          </li>
        </ul>
      </div>
      <div>
        <h3>취약성 분류</h3>
        <p>
          긴급 : 참여자들의 즉각적인 자금 손실이 가능하며, 서비스를 영구적으로 손상시킬 수 있는 문제
        </p>
        <p>
          높은 또는 심각 : 참여자들의 즉각적인 자금 손실이 가능하며, 서비스를 심각하게 손상시킬 수 있는 문제
        </p>
        <p>
          보통 : 참여자들의 자금 손실 정도가 이론적으로 최소이며, 서비스 사용자가 불만을 표현할 수 있는 문제
        </p>
        <p>
          낮은 : 사용자들의 불만을 표시할 수 있거나, 사소한 버그
        </p>
      </div>
      <div>
        <h3>버그 바운티의 범위</h3>
        <ul>
          <li>
            <p>
              Elyfi contract:&nbsp;
              <a href="https://github.com/elysia-dev/elyfi" target="_blank" className="bounty__link">
                https://github.com/elysia-dev/elyfi
              </a>
            </p>
          </li>
          <li>
            <p>
              Elyfi sub-graph:&nbsp;
              <a href="https://github.com/elysia-dev/elyfi-subgraph" target="_blank" className="bounty__link">
                https://github.com/elysia-dev/elyfi-subgraph
              </a>
            </p>
          </li>
          <li>
            <p>
              Elyfi web interface:&nbsp;
              <a href="https://github.com/elysia-dev/elyfi-web" target="_blank" className="bounty__link">
                https://github.com/elysia-dev/elyfi-web
              </a>
            </p>
          </li>
        </ul>
      </div>
    </section>
  )
}
const EngNotice = () => {
  return (
    <section className="bounty">
      <div className="bounty__title">
        <p className="bold">Bug Bounty</p>
        <hr />
      </div>
      <div className="bounty__notice">
        <p>The Elysia team is committed to delivering quality products and services, and we are grateful for community members who contribute to the project by giving us constructive feedback and reports.</p>
        <p>In this respect, we decided to launch a bug bounty program to review any potential bugs or exploits related to the ELYFI protocol.</p>
        <p>Valid reports submitted before July 15th will be subject to compensation as below.</p>
      </div>
      <div>
        <div className="bounty__title">
          <p className="bold">Copy of Bounty</p>
          <hr />
        </div>
        <table className="bounty__table">
          <tr>
            <td rowSpan={6}>
              <p>
                Likelihood
              </p>
            </td>
            <td>
              <p>
                Certain
              </p>
            </td>
            <td>
              <p>
                $2,500
              </p>
            </td>
            <td>
              <p>
                $10,000
              </p>
            </td>
            <td>
              <p>
                $30,000
              </p>
            </td>
            <td>
              <p>
                $100,000
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                High
              </p>
            </td>
            <td>
              <p>
                $1,000
              </p>
            </td>
            <td>
              <p>
                $2,500
              </p>
            </td>
            <td>
              <p>
                $10,000
              </p>
            </td>
            <td>
              <p>
                $30,000
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                Medium
              </p>
            </td>
            <td>
              <p>
                $250
              </p>
            </td>
            <td>
              <p>
                $1,000
              </p>
            </td>
            <td>
              <p>
                $2,500
              </p>
            </td>
            <td>
              <p>
                $10,000
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                Low
              </p>
            </td>
            <td>
              <p>
                $100
              </p>
            </td>
            <td>
              <p>
                $250
              </p>
            </td>
            <td>
              <p>
                $1,000
              </p>
            </td>
            <td>
              <p>
                $2,500
              </p>
            </td>
          </tr>
          <tr>
            <td className="bounty__table__line">
            </td>
            <td>
              <p>
                Low
              </p>
            </td>
            <td>
              <p>
                Medium
              </p>
            </td>
            <td>
              <p>
                High
              </p>
            </td>
            <td>
              <p>
                Critical
              </p>
            </td>
          </tr>
          <tr>
            <td colSpan={5} style={{ textAlign: "center" }}>
              <p>
                Severity
              </p>  
            </td>
          </tr>
        </table>
      </div>
      <div>
        <p>
          We will use the OWASP risk assessment methodology to determine the bug’s level of threat to the protocol.
        </p>
        <p>
          Columns indicate the likelihood of the bug, while rows show the severity of the damage. 
        </p>
      </div>
      <div>
        <div className="bounty__title">
          <p className="bold">Severity classification</p>
          <hr />
        </div>
        <ul>
          <li>
            <p>
              Low: Minor inconvenience for users
            </p>
          </li>
          <li>
            <p>
              Medium: Minimum damage or potential loss to users
            </p>
          </li>
          <li>
            <p>
              High: Immediate loss
            </p>
          </li>
          <li>
            <p>
              Critical: Immediate loss leading to permanent seize of operation
            </p>
          </li>
        </ul>
      </div>
      <div>
        <div className="bounty__title">
          <p className="bold">Rules</p>
          <hr />
        </div>
        <ul>
          <li>
            <p>
              Compensation will be paid in EL tokens 
            </p>
          </li>
          <li>
            <p>
              We recommend submitting a screenshot or video to help us better understand the situation
            </p>
          </li>
          <li>
            <p>
              You may not disclose the bug until the end of the bounty program
            </p>
          </li>
          <li>
            <p>
              Repeated claims will only be compensated once to the first reporter
            </p>
          </li>
          <li>
            <p>
              Eligibility for compensation will be determined by Elysia
            </p>
          </li>
        </ul>
      </div>
      <div>
        <p>
          Please submit all feedback and reports to support@elysia.land, or contact us directly through https://elysia.land 
        </p>
      </div>
    </section>
  )
}

export default Bounty;