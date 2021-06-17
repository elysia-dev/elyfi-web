import { FunctionComponent } from 'react'

interface Props {
  title: string,
  status: number,
  loan: number,
  interest: number,
  expiration: number,
  onClick: () => void,
}
const AssetList: FunctionComponent<Props> = (props: Props) => {
  const timestamp = new Date(props.expiration);

  return (
    <div className="portfolio__asset-list__info" onClick={props.onClick}>
      <p className="portfolio__asset-list__info__status">
        {props.status === 2 ? 
          "Repayment Completed"
          :
          props.status === 1 ?
            "Liquidation in progress" 
            :
            "To be repaid"
        }
      </p>
      <iframe style={{ width: "100%", height: 304, border: 0 }} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.2682992854884!2d127.0248853148802!3d37.501589735603424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca158643aa479%3A0x53843ee59beac03c!2z7ISc7Jq47Yq567OE7IucIOqwleuCqOq1rCDsl63sgrzrj5kg6rCV64Ko64yA66GcMTAw6ri4IDE0!5e0!3m2!1sko!2skr!4v1623842880474!5m2!1sko!2skr" />
      <div className="portfolio__asset-list__info__value__container">
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value bold" style={{ color: "#333333" }}>
            {props.title}
          </p>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value">
            대출금
          </p>
          <div>
            <span className="bold">{props.loan}</span> <span>USD</span>
          </div>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value">
            이자율
          </p>
          <div>
            <span className="bold">{props.interest}</span> <span>%</span>
          </div>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value">
            만기일
          </p>
          <div>
            <p className="bold">
              {timestamp.getFullYear() + "." + timestamp.getMonth() + "." + timestamp.getDate()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetList;