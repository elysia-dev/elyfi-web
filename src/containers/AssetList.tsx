import { useParams } from 'react-router-dom';
import AssetItem from 'src/components/AssetItem';
import { IAssetBond } from 'src/contexts/SubgraphContext';
import LoanProduct from 'src/enums/LoanProduct';
import useNavigator from 'src/hooks/useNavigator';
import { parseTokenId } from 'src/utiles/parseTokenId';

const AssetList: React.FC<{
  assetBondTokens: IAssetBond[];
}> = ({ assetBondTokens }) => {
  const navigate = useNavigator();
  const { lng } = useParams<{ lng: string }>();

  return (
    <div className="component__loan-list__container">
      {assetBondTokens
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
                navigate(`/${lng}/portfolio/${abToken.id}`);
              }}
            />
          );
        })}
    </div>
  );
};

export default AssetList;
