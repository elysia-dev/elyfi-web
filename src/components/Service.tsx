import { RefObject } from "react"
import { useTranslation, Trans } from 'react-i18next';
import MainGraph from 'src/components/MainGraph';

interface Props {
  serviceGraphPageY: RefObject<HTMLParagraphElement>;
}

const Service: React.FC<Props> = ({
  serviceGraphPageY
}) => {
  const { t } = useTranslation();

  return <>
    <h2 ref={serviceGraphPageY}>
      <Trans i18nKey={'main.graph.title'} />
    </h2>
    <MainGraph />
    <div className="main__service__comment pc-only">
      <p>{t('main.graph.investment-linked-financial')}</p>
      <div
        onClick={() =>
          window.open('https://www.fsc.go.kr/no040101?cnId=911')
        }>
        <h2>{t('main.graph.investment-linked-financial--button')}</h2>
      </div>
    </div>
  </>
}

export default Service;