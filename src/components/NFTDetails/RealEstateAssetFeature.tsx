import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  assetFeature: {
    title: string[];
    content: string[];
    image: string[];
  };
}

const RealEstateAssetFeature: React.FC<Props> = ({ assetFeature }) => {
  const { t } = useTranslation();
  const [currentImage, setImage] = useState(0);

  return (
    <section className="nft-details__real-estate-info__asset-feature">
      <h2>부동산 특징</h2>
      <div>
        <section>
          <img src={assetFeature.image[currentImage]} />
          <div>
            {assetFeature.image.map((image, index) => {
              return (
                <figure
                  onClick={() => setImage(index)}
                  className={currentImage !== index ? 'disable' : ''}>
                  <img src={image} alt="asset image" />
                </figure>
              );
            })}
          </div>
        </section>
        <section>
          {Array(assetFeature.title.length)
            .fill(0)
            .map((_x, index) => {
              return (
                <div key={index}>
                  <b>0{index + 1}</b>
                  <div>
                    <b>{assetFeature.title[index]}</b>
                    <p>{assetFeature.content[index]}</p>
                  </div>
                </div>
              );
            })}
        </section>
      </div>
    </section>
  );
};

export default RealEstateAssetFeature;
