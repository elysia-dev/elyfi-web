import { useTranslation } from 'react-i18next';
import NFTStructure from 'src/assets/images/market/NFTStructure.png';
import NFTStructureMobile from 'src/assets/images/market/NFTStructureMobile.svg';
import NFTStructureEn from 'src/assets/images/market/NFTStructureEN.png';
import NFTStructureMobileEn from 'src/assets/images/market/NFTStructureMobileEN.svg';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import Document from 'src/assets/images/market/document.svg';

interface Props {
  location: string;
  link: {
    grantDeed: string;
    ein: string;
    articleOfOrganization: string;
    statementOfInformation: string;
    llcOperationAgreement: string;
    rentalAgreement: string;
    collateralAgreement: string;
  };
}

const BondNFT: React.FC<Props> = ({ location, link }) => {
  const { t, i18n } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();

  return (
    <>
      {mediaQuery === MediaQuery.Mobile && (
        <img
          src={
            i18n.language === 'en' ? NFTStructureMobileEn : NFTStructureMobile
          }
          alt="image"
        />
      )}
      <table>
        {mediaQuery === MediaQuery.PC && (
          <tr>
            <td colSpan={2} className="image-wrapper">
              <img
                src={
                  mediaQuery === MediaQuery.PC
                    ? i18n.language === 'en'
                      ? NFTStructureEn
                      : NFTStructure
                    : i18n.language === 'en'
                    ? NFTStructureMobileEn
                    : NFTStructureMobile
                }
              />
            </td>
          </tr>
        )}
        <tr>
          <th>
            <b>{t('nftMarket.bondNftTable.header.0')}</b>
          </th>
          <td>
            <p>{t('nftMarket.bondNftTable.content.0', { location })}</p>
            <section>
              <a target="_blank" href={link.grantDeed} className="table-button">
                <img src={Document} alt="Document icon" />
                <p>{t('nftMarket.bondNftTable.button.section01.0')}</p>
              </a>
              <a className="table-button" target="_blank" href={link.ein}>
                <img src={Document} alt="Document icon" />
                <p>{t('nftMarket.bondNftTable.button.section01.1')}</p>
              </a>
              <a
                className="table-button"
                target="_blank"
                href={link.articleOfOrganization}>
                <img src={Document} alt="Document icon" />
                <p>{t('nftMarket.bondNftTable.button.section01.2')}</p>
              </a>
              <a
                className="table-button"
                target="_blank"
                href={link.statementOfInformation}>
                <img src={Document} alt="Document icon" />
                <p>{t('nftMarket.bondNftTable.button.section01.3')}</p>
              </a>
            </section>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.bondNftTable.header.1')}</b>
          </th>
          <td>
            <p>{t('nftMarket.bondNftTable.content.1')}</p>
            <section>
              <a
                className="table-button"
                target="_blank"
                href={link.llcOperationAgreement}>
                <img src={Document} alt="Document icon" />
                <p>{t('nftMarket.bondNftTable.button.section02.0')}</p>
              </a>
            </section>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.bondNftTable.header.2')}</b>
          </th>
          <td>
            <p>{t('nftMarket.bondNftTable.content.2')}</p>
            <section>
              <a
                className="table-button"
                target="_blank"
                href={link.rentalAgreement}>
                <img src={Document} alt="Document icon" />
                <p>{t('nftMarket.bondNftTable.button.section03.0')}</p>
              </a>
              <a
                className="table-button"
                target="_blank"
                href={link.collateralAgreement}>
                <img src={Document} alt="Document icon" />
                <p>{t('nftMarket.bondNftTable.button.section03.1')}</p>
              </a>
            </section>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.bondNftTable.header.3')}</b>
          </th>
          <td>
            <p>{t('nftMarket.bondNftTable.content.3')}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.bondNftTable.header.4')}</b>
          </th>
          <td>
            <p>{t('nftMarket.bondNftTable.content.4')}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.bondNftTable.header.5')}</b>
          </th>
          <td>
            <p>{t('nftMarket.bondNftTable.content.5')}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.bondNftTable.header.6')}</b>
          </th>
          <td>
            <p>{t('nftMarket.bondNftTable.content.6')}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.bondNftTable.header.7')}</b>
          </th>
          <td>
            <p>{t('nftMarket.bondNftTable.content.7')}</p>
          </td>
        </tr>
      </table>
    </>
  );
};

export default BondNFT;
