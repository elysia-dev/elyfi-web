import CountUp from 'react-countup';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import HeaderCircle from 'src/assets/images/title-circle.png';
import useTvl from 'src/hooks/useTvl';
import { useMemo } from 'react';

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
          return (
            <CountUp
              start={0}
              end={loading ? 0 : tvl}
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
