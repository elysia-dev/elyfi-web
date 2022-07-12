import { useTranslation } from 'react-i18next';
import NFTStructure from 'src/assets/images/market/NFTStructure.png';

const BondNFT = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('nftMarket.bondNft')}</h2>
      <table>
        <tr>
          <td colSpan={2} className="image-wrapper">
            <img src={NFTStructure} />
          </td>
        </tr>
        <tr>
          <th>{t('nftMarket.bondNftTable.header.0')}</th>
          <td>{t('nftMarket.bondNftTable.content.0')}</td>
        </tr>
        <tr>
          <th>{t('nftMarket.bondNftTable.header.1')}</th>
          <td>{t('nftMarket.bondNftTable.content.1')}</td>
        </tr>
        <tr>
          <th>{t('nftMarket.bondNftTable.header.2')}</th>
          <td>{t('nftMarket.bondNftTable.content.2')}</td>
        </tr>
        <tr>
          <th>{t('nftMarket.bondNftTable.header.3')}</th>
          <td>{t('nftMarket.bondNftTable.content.3')}</td>
        </tr>
      </table>
    </>
  );
};

export default BondNFT;
