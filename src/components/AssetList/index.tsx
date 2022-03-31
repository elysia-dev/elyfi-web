import Skeleton from 'react-loading-skeleton';
import { useHistory, useParams } from 'react-router-dom';
import AssetItem from 'src/components/AssetList/AssetItem';
import { IAssetBond } from 'src/core/types/reserveSubgraph';
import LoanProduct from 'src/enums/LoanProduct';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import { parseTokenId } from 'src/utiles/parseTokenId';

const AssetList: React.FC<{
  assetBondTokens?: IAssetBond[];
  prevRoute?: 'deposit' | 'governance';
}> = ({ assetBondTokens, prevRoute }) => {
  const history = useHistory();
  const { lng } = useParams<{ lng: string }>();
  const { value: mediaQuery } = useMediaQueryType();

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
                      state: { route: prevRoute },
                    });
                  }}
                />
              );
            })
        : Array(mediaQuery === MediaQuery.PC ? 3 : 2)
            .fill(0)
            .map(() => (
              <Skeleton
                width={mediaQuery === MediaQuery.PC ? 300 : 135}
                height={mediaQuery === MediaQuery.PC ? 328.5 : 149}
              />
            ))}
    </div>
  );
};

export default AssetList;
