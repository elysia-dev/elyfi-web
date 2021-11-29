import { useHistory } from 'react-router-dom';
import AssetItem from 'src/components/AssetItem';
import { GetAllAssetBonds_assetBondTokens } from 'src/queries/__generated__/GetAllAssetBonds';

const AssetList: React.FC<{
  assetBondTokens: GetAllAssetBonds_assetBondTokens[];
}> = ({ assetBondTokens }) => {
  const history = useHistory();

  return (
    <div className="portfolio__asset-list__info__container">
      {assetBondTokens.map((abToken, index) => {
        return (
          <AssetItem
            key={index}
            abToken={abToken}
            onClick={() => {
              history.push({
                pathname: `/portfolio/${abToken.id}`,
              });
            }}
          />
        );
      })}
    </div>
  );
};

export default AssetList;
