import { RefObject, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from 'react-router-dom';
import LanguageType from "src/enums/LanguageType";

const GovernanceGuideBox = lazy(() => import('src/components/Governance/GovernanceGuideBox'));

interface Props {
  headerRef: RefObject<HTMLDivElement>;
}

const Header: React.FC<Props> = ({
  headerRef
}) => {
  const { t } = useTranslation();
  const History = useHistory();
  const { lng } = useParams<{ lng: string }>();

  return (
    <>
      <section
        ref={headerRef}
        className="governance__content"
        style={{
          marginBottom: 100,
        }}>
        <div>
          <h2>{t('governance.title')}</h2>
          <p>{t('governance.content')}</p>
        </div>
        <div className="governance__content__button__wrapper">
          <div
            className="governance__content__button"
            onClick={() =>
              History.push({ pathname: `/${lng}/staking/ELFI` })
            }>
            <p>{t('governance.button--staking')}</p>
          </div>
          <div
            className="governance__content__button"
            onClick={() =>
              window.open(
                lng === LanguageType.KO
                  ? 'https://elysia.gitbook.io/elyfi-user-guide/v/korean-2/governance/governance-faq'
                  : 'https://elysia.gitbook.io/elyfi-user-guide/governance',
              )
            }>
            <p>{t('governance.button--governance_faq')}</p>
          </div>
        </div>
      </section>
      <section className="governance__elyfi-graph">
        <Suspense fallback={<div style={{ height: 120 }} />}>
          <GovernanceGuideBox />
        </Suspense>
      </section>
    </>
  )
}

export default Header;