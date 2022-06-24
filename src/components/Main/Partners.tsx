import { lazy, RefObject, useEffect } from 'react';

import HaechiLabs from 'src/assets/images/main/haechi-labs.svg';
import SHIN from 'src/assets/images/main/shin.svg';
import BKI from 'src/assets/images/main/bkl.svg';
import FocusLaw from 'src/assets/images/main/focus_law_asia.svg';
import HUB from 'src/assets/images/main/hub.svg';
import HOW from 'src/assets/images/main/how.svg';
import TSMP from 'src/assets/images/main/tsmp.svg';
import Fbg from 'src/assets/images/main/fbg.svg';
import Blocore from 'src/assets/images/main/blocore.svg';
import Certik from 'src/assets/images/main/certik.png';
import { useTranslation, Trans } from 'react-i18next';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

interface Props {
  auditPageY: RefObject<HTMLParagraphElement>;
  setIsPartnersLoading: () => void;
}

const Partners: React.FC<Props> = ({ auditPageY, setIsPartnersLoading }) => {
  const { t } = useTranslation();

  useEffect(() => {
    setIsPartnersLoading();
  }, []);

  return (
    <>
      <div>
        <h2 ref={auditPageY} className="bold">
          <Trans i18nKey={'main.partners.title'} />
        </h2>
        <section>
          <LazyImage src={Certik} name="" />
          <LazyImage src={HaechiLabs} name="" />
        </section>
      </div>
      <div>
        <h2 className="bold">
          <strong>Backed</strong> by
        </h2>
        <div>
          <LazyImage src={Fbg} name={Fbg} />
          <LazyImage src={Blocore} name={Blocore} />
        </div>
      </div>
      <div className="main__dao">
        <h2>
          <Trans i18nKey="main.dao.title" />
        </h2>
        <div>
          <div>
            <p>{t('main.dao.content.0')}</p>
          </div>
          <div>
            <p>{t('main.dao.content.1')}</p>
          </div>
          <div>
            <p>{t('main.dao.content.2')}</p>
          </div>
        </div>
      </div>
      <div>
        <h2>{t('main.partners.lawfirm')}</h2>
        <div className="main__partners__lawfirm">
          {[SHIN, BKI, FocusLaw, HUB, HOW, TSMP].map((LawFirm, _index) => {
            return (
              <LazyImage
                name={`partner_${_index}`}
                src={LawFirm}
                key={_index}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Partners;
