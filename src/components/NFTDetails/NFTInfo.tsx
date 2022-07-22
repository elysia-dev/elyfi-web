import { useCallback } from 'react';
import ContractVideo from 'src/assets/images/market/contractusa.mp4';
import Clip from 'src/assets/images/market/clip.svg';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import NFTTraitType from 'src/enums/NFTTraitType';
import Skeleton from 'react-loading-skeleton';
import { formatCommaSmallZeroDisits } from 'src/utiles/formatters';
import Arrow from 'src/assets/images/market/arrow.svg';
import { NFTType } from '.';

interface Props {
  type: string;
  interest: number;
  nftInfo: NFTType | undefined;
}

const NFTInfo: React.FC<Props> = ({ type, interest, nftInfo }) => {
  const { t, i18n } = useTranslation();

  // const nftData = useCallback(
  //   (traitType: NFTTraitType, nft?: NFTType) => {
  //     if (!nft) {
  //       return <Skeleton width={65} height={18} />;
  //     }
  //     return nft?.attributes.find((info) => {
  //       return info.trait_type === traitType;
  //     })?.value;
  //   },
  //   [nftInfo],
  // );

  const nftDate = useCallback(
    (traitType: NFTTraitType, nft?: NFTType) => {
      if (!nft) {
        return <Skeleton width={110} height={18} />;
      }
      // return moment().format('YYYY.MM.DD');
      return moment(
        nft?.attributes
          .find((info) => {
            return info.trait_type === traitType;
          })
          ?.value.split('KST')[0],
      ).format('YYYY.MM.DD');
    },
    [nftInfo],
  );

  const nftLink = useCallback(
    (hash: string) => {
      return `https://elysia.mypinata.cloud/ipfs/${hash}`;
    },
    [nftInfo],
  );

  return (
    <>
      <div>
        <figure>
          <video
            src={ContractVideo}
            muted={true}
            loop={true}
            autoPlay={true}
            playsInline></video>
        </figure>
        <table>
          <tr>
            <th>{t('nftMarket.nftInfoTable.0')}</th>
            <td colSpan={3}>{type}</td>
          </tr>
          <tr>
            <th>{t('nftMarket.nftInfoTable.1')}</th>
            <td colSpan={3}>
              {t('nftMarket.nftInfoDetails.0')}
              <ul>
                <li>{t('nftMarket.nftInfoDetails.1')}</li>
                <li>{t('nftMarket.nftInfoDetails.2')}</li>
                <li>{t('nftMarket.nftInfoDetails.3')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>{t('nftMarket.nftInfoTable.2')}</th>
            {/* <td>{nftData(NFTTraitType.Principal, nftInfo)}</td> */}
            <td>$10</td>
            <th>{t('nftMarket.nftInfoTable.3')}</th>
            <td>$0.39</td>
          </tr>
          <tr>
            <th>{t('nftMarket.nftInfoTable.4')}</th>
            {/* <td>{nftData(NFTTraitType.ExpectedAPY, nftInfo)}</td> */}
            <td>12%</td>
            <th>{t('nftMarket.nftInfoTable.5')}</th>
            {/* <td>{nftData(NFTTraitType.OverdueAPY, nftInfo)}</td> */}
            <td>15%</td>
          </tr>
          <tr>
            <th>{t('nftMarket.nftInfoTable.6')}</th>
            {/* <td colSpan={3}>{nftDate(NFTTraitType.LoanDate, nftInfo)} KST</td> */}
            <td colSpan={3}>{t('nftMarket.nftInfoTable.9')}</td>
          </tr>
          <tr>
            <th>{t('nftMarket.nftInfoTable.7')}</th>
            {/* <td colSpan={3}>
              {nftDate(NFTTraitType.MaturityDate, nftInfo)} KST
            </td> */}
            <td colSpan={3}>{t('nftMarket.nftInfoTable.10')}</td>
          </tr>
          <tr>
            <th>{t('nftMarket.nftInfoTable.8')}</th>
            <td colSpan={3}>
              <div>
                <a
                  target="_blank"
                  href={nftLink(
                    'QmfVVX5U4ig3UcRqHCFqCdrY2a1wN9tpTEpZosAisB7324',
                  )}>
                  <img src={Clip} />
                  {t('nftMarket.nftInfoTableButton.0')}
                </a>
                <a
                  target="_blank"
                  href={nftLink(
                    'QmcK7hwCWDEWGNUUwR3RqqCgMfgjhegm1SCQ3DZDZj5nFn',
                  )}>
                  <img src={Clip} />
                  {t('nftMarket.nftInfoTableButton.1')}
                </a>
                <a
                  target="_blank"
                  href={nftLink(
                    'QmaYAHytgmBeM16vVj3S4TVFCouTbJxJhj47wm8YFet8ma',
                  )}>
                  <img src={Clip} />
                  {t('nftMarket.nftInfoTableButton.2')}
                </a>
                <a
                  target="_blank"
                  href={nftLink(
                    'QmQigAJXwPAzxLPPBrEMCyB6VvuHcBXP6ayT4NCnhoWaGt',
                  )}>
                  <img src={Clip} alt="Document icon" />
                  {t('nftMarket.bondNftTable.button.section01.0')}
                </a>
                <a
                  target="_blank"
                  href={nftLink(
                    'Qmf8gvkju75fbKaVykTHiCoGZmY1xwYqxdbmJrLy2unRMZ',
                  )}>
                  <img src={Clip} alt="Document icon" />
                  {t('nftMarket.bondNftTable.button.section01.1')}
                </a>
                <a
                  target="_blank"
                  href={nftLink(
                    'QmVCJT1FQmnhSh39rBenS3turKDyNehCPYGifzte9Wbc7E',
                  )}>
                  <img src={Clip} alt="Document icon" />
                  {t('nftMarket.bondNftTable.button.section01.2')}
                </a>
                <a
                  target="_blank"
                  href={nftLink(
                    'QmZX2rAbcgRr35B8U7HrmXc74raSt8qQz3oQcRWhb2iXZh',
                  )}>
                  <img src={Clip} alt="Document icon" />
                  {t('nftMarket.bondNftTable.button.section01.3')}
                </a>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default NFTInfo;
