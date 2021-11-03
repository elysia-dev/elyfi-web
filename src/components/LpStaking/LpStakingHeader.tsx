import Guide from '../Guide';

type Props = {
  TotalLiquidity: string;
  apr: number;
};

function LpStakingHeader(props: Props) {
  const { TotalLiquidity, apr } = props;
  return (
    <>
      <div
        style={{
          padding: '19px 25px 17px 29px',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #E6E6E6',
            paddingBottom: 12.5,
          }}>
          <div
            className="spoqa__bold"
            style={{
              fontSize: 17,
            }}>
            APR
            <Guide />
          </div>
          <div
            className="spoqa__bold"
            style={{
              fontSize: 20,
            }}>
            {apr}
            <div
              className="spoqa__bold"
              style={{
                color: '#646464',
                display: 'inline-block',
                marginLeft: 2,
              }}>
              %
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 17.5,
          }}>
          <div
            className="spoqa__bold"
            style={{
              fontSize: 17,
            }}>
            총 유동성
            <Guide />
          </div>
          <div
            className="spoqa__bold"
            style={{
              fontSize: 20,
            }}>
            <div
              className="spoqa__bold"
              style={{
                color: '#646464',
                display: 'inline-block',
                marginRight: 2,
              }}>
              $
            </div>
            {TotalLiquidity}
          </div>
        </div>
      </div>
    </>
  );
}

export default LpStakingHeader;
