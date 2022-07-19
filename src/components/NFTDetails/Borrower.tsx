import { useTranslation } from 'react-i18next';
import Clip from 'src/assets/images/market/clip.svg';

interface Props {
  name: string;
  licenseNumber: string;
  registrationLink: string;
}

const Borrower: React.FC<Props> = ({
  name,
  licenseNumber,
  registrationLink,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <table>
        <tr>
          <th>{t('nftMarket.borrowerTable.header.0')}</th>
          <td>{name}</td>
        </tr>
        <tr>
          <th>{t('nftMarket.borrowerTable.header.1')}</th>
          <td>{licenseNumber}</td>
        </tr>
        <tr>
          <th>{t('nftMarket.borrowerTable.header.2')}</th>
          <td>
            <div>
              <a target="_blank" href={registrationLink}>
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
