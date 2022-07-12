import { useTranslation } from 'react-i18next';
import Clip from 'src/assets/images/market/clip.svg';

const Borrower = () => {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('nftMarket.borrower')}</h2>
      <table>
        <tr>
          <th>{t('nftMarket.borrowerTable.header.0')}</th>
          <td>Elyloan Inc</td>
        </tr>
        <tr>
          <th>{t('nftMarket.borrowerTable.header.1')}</th>
          <td>220111-0189192</td>
        </tr>
        <tr>
          <th>{t('nftMarket.borrowerTable.header.2')}</th>
          <td>해당없음</td>
        </tr>
        <tr>
          <th>{t('nftMarket.borrowerTable.header.3')}</th>
          <td>해당없음</td>
        </tr>
        <tr>
          <th>{t('nftMarket.borrowerTable.header.4')}</th>
          <td>
            <div>
              <a>
                <img src={Clip} />
                {t('nftMarket.borrowerTable.button')}
              </a>
            </div>
          </td>
        </tr>
      </table>
    </>
  );
};

export default Borrower;
