import { useHistory, useParams } from 'react-router-dom';
import AssetItem from 'src/components/AssetItem';
import { IAssetBond } from 'src/contexts/SubgraphContext';

const AssetList: React.FC<{
  assetBondTokens: IAssetBond[];
}> = ({ assetBondTokens }) => {
  const history = useHistory();
  const { lng } = useParams<{ lng: string }>();

  return (
    <div className="component__loan-list__container">
      {assetBondTokens.map((abToken, index) => {
        return (
          <AssetItem
            key={index}
            abToken={abToken}
            onClick={() => {
              history.push({
                pathname: `/${lng}/portfolio/${abToken.id}`,
              });
            }}
          />
        );
      })}
    </div>
  );
};

export default AssetList;
