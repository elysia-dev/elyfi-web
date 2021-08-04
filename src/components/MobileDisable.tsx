import { useTranslation } from 'react-i18next';
import MainBackground from 'src/assets/images/main-background.png';
import LanguageConverter from './LanguageConverter';

const MobileDisable = () => {
  const { t } = useTranslation();
  return (
    <div className="elysia" style={{ minWidth: 0, minHeight: 0 }}>
      <section className="mobile" style={{ backgroundImage: `url(${MainBackground})` }}>
        <div>
          <h2>
            {t("mobile.title")}
          </h2>
          <p>
            {t("mobile.content.0")}
          </p>
          <p>
            {t("mobile.content.1")}
          </p>
        </div>
      </section>
      <div className="footer--dashboard" style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
        <LanguageConverter />
      </div>
    </div>
  )
}

export default MobileDisable;