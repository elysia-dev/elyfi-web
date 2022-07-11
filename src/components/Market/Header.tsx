import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  headerRef: RefObject<HTMLDivElement>;
}

const Header: React.FC<Props> = ({ headerRef }) => {
  const { t } = useTranslation();

  return (
    <section className="market__header" ref={headerRef}>
      <h1>부동산 상품마켓</h1>
      <p>원하는 부동산 상품을 직접 고르고 구매할 수 있어요!</p>
    </section>
  );
};

export default Header;
