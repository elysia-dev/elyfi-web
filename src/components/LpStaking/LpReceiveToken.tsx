import envs from 'src/core/envs';
import Guide from '../Guide';
import LpButton from './LpButton';

type Props = {
  stakedToken: string;
  firstToken: string;
  secondToken: string;
};

function LpReceiveToken(props: Props) {
  const { firstToken, secondToken } = props;
  return (
    <div className="lp_receive_token_wrapper">
      <div>
        <div className="spoqa__bold">
          {`${firstToken}-${secondToken} LP 토큰`}
          <Guide />
        </div>
        <div>
          <a
            className="spoqa__medium"
            target="_blank"
            rel="noopener noreferrer"
            href={
              secondToken === 'DAI'
                ? `https://app.uniswap.org/#/add/${envs.governanceAddress}/${envs.wEth}`
                : `https://app.uniswap.org/#/add/${envs.governanceAddress}/${envs.daiAddress}`
            }>
            <button>LP Token 받기</button>
          </a>
        </div>
      </div>
      <div className="spoqa">
        {`Uniswap V3 에 있는 ${firstToken}-${secondToken} 풀에 유동성을 제공함으로써`}{' '}
        <span className="spoqa__bold">{`${firstToken}-${secondToken} LP`}</span>{' '}
        토큰을 받으실 수 있습니다!
      </div>
    </div>
  );
}

export default LpReceiveToken;
