import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  headerRef: RefObject<HTMLDivElement>;
}

const Header: React.FC<Props> = ({ headerRef }) => {
  const { t } = useTranslation();

  return (
    <section className="market__header" ref={headerRef}>
      <h1>{t('market.title')}</h1>
      <div>
        <p>BETA</p>
      </div>
      <p>{t('market.content')}</p>
    </section>
  );
};

export default Header;
