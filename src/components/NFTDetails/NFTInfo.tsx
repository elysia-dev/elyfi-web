import { useCallback } from 'react';
import ContractVideo from 'src/assets/images/market/contract.mp4';
import Clip from 'src/assets/images/market/clip.svg';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import NFTTraitType from 'src/enums/NFTTraitType';
import Skeleton from 'react-loading-skeleton';
import NewTab from 'src/assets/images/market/new_tab.png';
import { NFTType } from '.';

interface Props {
  type: string;
  interest: number;
  nftInfo: NFTType | undefined;
  openseaLink: string;
}

const NFTInfo: React.FC<Props> = ({ type, interest, nftInfo, openseaLink }) => {
  const { t } = useTranslation();

  const nftData = useCallback(
    (traitType: NFTTraitType, nft?: NFTType) => {
      if (!nft) {
        return <Skeleton width={65} height={18} />;
      }
      return nft?.attributes.find((info) => {
        return info.trait_type === traitType;
      })?.value;
    },
    [nftInfo],
  );

  const nftDate = useCallback(
    (traitType: NFTTraitType, nft?: NFTType) => {
      if (!nft) {
        return <Skeleton width={110} height={18} />;
      }
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
      <section>
        <h2>{t('nftMarket.nftInfo')}</h2>
        <a href={openseaLink} target="_blank">
          <img src={NewTab} alt="new tab icon" />
        </a>
      </section>
      <div>
        <figure>
          <video
            src={ContractVideo}
            muted={true}
            loop={true}
            autoPlay={true}></video>
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
            <td>{nftData(NFTTraitType.Principal, nftInfo)}</td>
            <th>{t('nftMarket.nftInfoTable.3')}</th>
            <td>${interest}</td>
          </tr>
          <tr>
            <th>{t('nftMarket.nftInfoTable.4')}</th>
            <td>{nftData(NFTTraitType.ExpectedAPY, nftInfo)}</td>
            <th>{t('nftMarket.nftInfoTable.5')}</th>
            <td>{nftData(NFTTraitType.OverdueAPY, nftInfo)}</td>
          </tr>
          <tr>
            <th>{t('nftMarket.nftInfoTable.6')}</th>
            <td colSpan={3}>{nftDate(NFTTraitType.LoanDate, nftInfo)} KST</td>
          </tr>
          <tr>
            <th>{t('nftMarket.nftInfoTable.7')}</th>
            <td colSpan={3}>
              {nftDate(NFTTraitType.MaturityDate, nftInfo)} KST
            </td>
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
              </div>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default NFTInfo;
