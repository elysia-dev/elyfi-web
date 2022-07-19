import YouTube from 'react-youtube';
import RealEstateAroundAssets from './RealEstateAroundAssets';
import RealEstateAssetFeature from './RealEstateAssetFeature';
import RealEstateTable from './RealEstateTable';

interface Props {
  youtubeLink: string;
  tableInfo: {
    location: string;
    locationLink: string;
    assetType: string;
    landArea: string;
    yearOfRemodeling: string;
    buildingArea: string;
    floor: string;
    estimatedSalesPrice: string;
  };
  assetFeature: {
    title: string[];
    content: string[];
    image: string[];
  };
  aroundAssetInfo: {
    title: string;
    image: string;
    price: string;
    completion: string;
    landArea: string;
  }[];
}

const RealEstateInfo: React.FC<Props> = (props) => {
  return (
    <>
      <YouTube
        videoId={props.youtubeLink}
        iframeClassName={'nft-details__borrower__youtube'}
      />
      <RealEstateTable tableInfo={props.tableInfo} />
      <RealEstateAssetFeature assetFeature={props.assetFeature} />
      <RealEstateAroundAssets aroundAssetInfo={props.aroundAssetInfo} />
    </>
  );
};

export default RealEstateInfo;
