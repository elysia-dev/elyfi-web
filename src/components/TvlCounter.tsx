import CountUp from 'react-countup';
import HeaderCircle from 'src/assets/images/deposit/title-circle.svg';
import useTvl from 'src/hooks/useTvl';
import Skeleton from 'react-loading-skeleton';
import { useMemo } from 'react';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';

const usdFormatter = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
});

const TvlCounter: React.FC = () => {
  const { value: mediaQuery } = useMediaQueryType();
  const { value: tvl, loading } = useTvl();

  return (
    <div
      className="deposit__title"
      style={{
        backgroundImage: `url(${HeaderCircle})`,
      }}>
      <p className="montserrat__bold">Total Value Locked</p>
      {
        // WHY use useMemo?
        // Counter should be rerender with ONLY loading & tvl
        // setInterval make some rerendering when the changes is not related the component
        useMemo(() => {
          return loading ? (
            <Skeleton
              width={200}
              height={mediaQuery === MediaQuery.PC ? 66 : 42}
            />
          ) : (
            <CountUp
              start={0}
              end={tvl}
              formattingFn={(number) => usdFormatter.format(number)}
              decimals={4}
              duration={2}>
              {({ countUpRef }) => <h2 className="blue" ref={countUpRef} />}
            </CountUp>
          );
        }, [loading, tvl])
      }
    </div>
  );
};

export default TvlCounter;
