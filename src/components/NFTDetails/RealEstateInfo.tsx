import { useTranslation } from 'react-i18next';
import BondAsset from 'src/assets/images/market/bondAssets.png';

const RealEstateInfo = () => {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('nftMarket.realEstateInfo')}</h2>
      <div>
        <figure>
          <img src={BondAsset} alt="Bond Asset" />
        </figure>
        <section>
          <b>Norwalk Ave</b>
          <table>
            <tr>
              <th>{t('nftMarket.realEstateInfoTable.0')}</th>
              <td>2046 Norwalk Ave, LA, CA 90041</td>
            </tr>
            <tr>
              <th>{t('nftMarket.realEstateInfoTable.1')}</th>
              <td>6,214 sqft / 1,034 + 350 sqft</td>
            </tr>
            <tr>
              <th>{t('nftMarket.realEstateInfoTable.2')}</th>
              <td>단독 주택</td>
            </tr>
            <tr>
              <th>{t('nftMarket.realEstateInfoTable.3')}</th>
              <td>
                Eagle Rock은 Occidental College가 위치해 있는 지역으로 근처에
                상업거리인 Colorado Blvd가 인접 하여 좋은 입지를 가지고
                있습니다.
              </td>
            </tr>
          </table>
        </section>
      </div>
    </>
  );
};

export default RealEstateInfo;
