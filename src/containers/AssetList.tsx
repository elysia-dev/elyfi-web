import Skeleton from 'react-loading-skeleton';
import { useHistory, useParams } from 'react-router-dom';
import AssetItem from 'src/components/AssetItem';
import { IAssetBond } from 'src/core/types/reserveSubgraph';
import LoanProduct from 'src/enums/LoanProduct';
import { parseTokenId } from 'src/utiles/parseTokenId';

const AssetList: React.FC<{
  assetBondTokens?: IAssetBond[];
}> = ({ assetBondTokens }) => {
  const history = useHistory();
  const { lng } = useParams<{ lng: string }>();

  return (
    <div className="component__loan-list__container">
      {assetBondTokens
        ? assetBondTokens
            .filter((data) => {
              const tokenId = parseTokenId(data.id);
              return LoanProduct[tokenId.productNumber] !== 'Others';
            })
            .map((abToken, index) => {
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
            })
        : Array(3)
            .fill(0)
            .map(() => <Skeleton width={300} height={328.5} />)}
    </div>
  );
};

export default AssetList;
