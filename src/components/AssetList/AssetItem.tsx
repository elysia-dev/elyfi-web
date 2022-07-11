import { FunctionComponent, lazy, Suspense, useEffect, useState } from 'react';
import { toCompactForBignumber, toPercent } from 'src/utiles/formatters';
import { useTranslation } from 'react-i18next';
import Slate, { baseUrl } from 'src/clients/Slate';
import ReserveData from 'src/core/data/reserves';
import { IAssetBond } from 'src/core/types/reserveSubgraph';
import Skeleton from 'react-loading-skeleton';

const UndefinedImage = lazy(() => import('src/utiles/undefinedImage'));

const AssetItem: FunctionComponent<{
  abToken: IAssetBond;
  onClick: () => void;
  style?: React.CSSProperties;
}> = ({ abToken, onClick, style }) => {
  const { t } = useTranslation();
  const [image, setImage] = useState('');
  const tokenInfo = ReserveData.find(
    (reserve) => reserve.address === abToken?.reserve.id,
  );

  const fetchImage = async () => {
    // hard coding!!!
    // 아래 아이디의 경우 이미지를 넣는 기획이 없을때 발행한 NFT라서 이미지가 없음
    // 통일 성을 위해, 해당 경우만 하드코딩으로 예외처리해서 이미지를 보여주도록 구현
    if (
      abToken.id ===
      '115792089237316195422007842550160057480242544124026915590235438085798243682305'
    ) {
      return setImage(
        'https://elysia-public.s3.ap-northeast-2.amazonaws.com/elyfi/borrow01.png',
      );
    }
    try {
      const response = await Slate.fetctABTokenIpfs(abToken.ipfsHash || '');
      setImage(`${baseUrl}/${response.data.images[0]?.hash}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [abToken]);

  return (
    <div className="component__loan-list" style={style} onClick={onClick}>
      <div className="component__loan-list__image">
        <Suspense fallback={<Skeleton width={'100%'} height={'100%'} />}>
          <UndefinedImage image={image} setImage={setImage} />
        </Suspense>
      </div>
      <div className="component__loan-list__data">
        <div>
          <p>{t('loan.loan__interest_rate')}</p>
          <p className="bold">{toPercent(abToken.interestRate || '0')}</p>
        </div>
        <div>
          <p>{t('loan.loan__borrowed')}</p>
          <p className="bold">
            {'$ ' +
              toCompactForBignumber(
                abToken.principal || '0',
                tokenInfo?.decimals,
              )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetItem;
