import { lazy, RefObject, Suspense } from "react";
import { useTranslation, Trans } from 'react-i18next';

import Advantages00 from 'src/assets/images/main/advantages00.svg';
import Advantages01 from 'src/assets/images/main/advantages01.svg';
import Advantages02 from 'src/assets/images/main/advantages02.svg';
import Advantages03 from 'src/assets/images/main/advantages03.svg';
import Advantages04 from 'src/assets/images/main/advantages04.svg';
import Advantages05 from 'src/assets/images/main/advantages05.svg';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

interface Props {
  guideY: RefObject<HTMLParagraphElement>;
}

const Advantage: React.FC<Props> = ({
  guideY
}) => {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<p>loading..</p>}>
      <h2 ref={guideY}>
        <Trans i18nKey={'main.advantages.header'} />
      </h2>
      <div className="main__advantages__container">
        {[
          [
            Advantages00,
            t('main.advantages.section.0.header'),
            t('main.advantages.section.0.content'),
          ],
          [
            Advantages01,
            t('main.advantages.section.1.header'),
            t('main.advantages.section.1.content'),
          ],
          [
            Advantages02,
            t('main.advantages.section.2.header'),
            t('main.advantages.section.2.content'),
          ],
          [
            Advantages03,
            t('main.advantages.section.3.header'),
            t('main.advantages.section.3.content'),
          ],
          [
            Advantages04,
            t('main.advantages.section.4.header'),
            t('main.advantages.section.4.content'),
          ],
          [
            Advantages05,
            t('main.advantages.section.5.header'),
            t('main.advantages.section.5.content'),
          ],
        ].map((data, _index) => {
          return (
            <div key={`advantage_${_index}`}>
              <LazyImage src={data[0]} name="index" />
              <div>
                <h2>{data[1]}</h2>
                <p>{data[2]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Suspense>
  )
}

export default Advantage;