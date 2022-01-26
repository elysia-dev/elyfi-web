import { FunctionComponent, useContext } from 'react';
import { BigNumber, utils } from 'ethers';
import CountUp from 'react-countup';
import elfi from 'src/assets/images/ELFI.png';
import { formatDecimalFracionDigit, toCompact } from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import getAddressesByPool from 'src/core/utils/getAddressesByPool';
import { StakedLpItemProps } from 'src/core/types/LpStakingTypeProps';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import { lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import moment from 'moment';
import { useWeb3React } from '@web3-react/core';
import { ethers } from '@elysia-dev/contract-typechain/node_modules/ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import TxContext from 'src/contexts/TxContext';
import { lpTokenValues } from 'src/utiles/lpTokenValues';
import RecentActivityType from 'src/enums/RecentActivityType';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import ModalViewType from 'src/enums/ModalViewType';
import TransactionType from 'src/enums/TransactionType';
import ElyfiVersions from 'src/enums/ElyfiVersions';

const StakedLpItem: FunctionComponent<StakedLpItemProps> = (props) => {
  const {
    position,
    setUnstakeTokenId,
    expectedReward,
    positionInfo,
    round,
    currentRound,
  } = props;
  const { t } = useTranslation();
  const { poolAddress, rewardTokenAddress } = getAddressesByPool(position);
  const {
    rewardToken,
    beforeRewardToken,
    tokenImg,
    rewardTokenType,
    pricePerLiquidity,
    lpTokenType,
  } = positionInfo();
  const stakedLiquidity =
    parseFloat(utils.formatEther(position.liquidity)) * pricePerLiquidity;
  const { account, library, chainId } = useWeb3React();
  const { setTransaction } = useContext(TxContext);
  const staker = new ethers.Contract(
    envs.stakerAddress,
    stakerABI,
    library.getSigner(),
  );
  const iFace = new ethers.utils.Interface(stakerABI);

  const unstake = async (
    poolAddress: string,
    rewardTokenAddress: string,
    tokenId: string,
    round: number,
  ) => {
    try {
      const res = await staker.multicall([
        iFace.encodeFunctionData('unstakeToken', [
          lpTokenValues(poolAddress, envs.governanceAddress, round - 1),
          tokenId,
        ]),
        iFace.encodeFunctionData('unstakeToken', [
          lpTokenValues(poolAddress, rewardTokenAddress, round - 1),
          tokenId,
        ]),
        iFace.encodeFunctionData('withdrawToken', [tokenId, account, '0x']),
      ]);
      setTransaction(
        res,
        buildEventEmitter(
          ModalViewType.LPStakingModal,
          TransactionType.Unstake,
          JSON.stringify({
            version: ElyfiVersions.V1,
            chainId,
            address: account,
            tokenId,
          }),
        ),
        'Withdraw' as RecentActivityType,
        () => {},
        () => {},
      );
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const migration = async (
    poolAddress: string,
    rewardTokenAddress: string,
    tokenId: string,
    round: number,
  ) => {
    try {
      const res = await staker.multicall([
        iFace.encodeFunctionData('unstakeToken', [
          lpTokenValues(poolAddress, envs.governanceAddress, round - 1),
          tokenId,
        ]),
        iFace.encodeFunctionData('unstakeToken', [
          lpTokenValues(poolAddress, rewardTokenAddress, round - 1),
          tokenId,
        ]),
        iFace.encodeFunctionData('stakeToken', [
          lpTokenValues(poolAddress, envs.governanceAddress, round),
          tokenId,
        ]),
        iFace.encodeFunctionData('stakeToken', [
          lpTokenValues(poolAddress, rewardTokenAddress, round),
          tokenId,
        ]),
      ]);

      setTransaction(
        res,
        buildEventEmitter(
          ModalViewType.LPStakingModal,
          TransactionType.Migrate,
          JSON.stringify({
            version: ElyfiVersions.V1,
            chainId,
            address: account,
            tokenId,
          }),
        ),
        'LPMigration' as RecentActivityType,
        () => {},
        () => {},
      );
    } catch (error) {
      console.error(error);
      // throw Error(error);
    }
  };

  const startedDate = moment
    .unix(lpUnixTimestamp[currentRound].startedAt)
    .format('YYYY.MM.DD hh:mm:ss Z');
  const endedDate = moment
    .unix(lpUnixTimestamp[currentRound].endedAt)
    .format('YYYY.MM.DD hh:mm:ss Z');

  const unstakingHandler = async (position: {
    id: string;
    liquidity: BigNumber;
    owner: string;
    staked: boolean;
    tokenId: number;
  }) => {
    try {
      await unstake(poolAddress, rewardTokenAddress, position.id, round);
      setUnstakeTokenId(position.tokenId);
    } catch (error) {
      console.error(error);
    }
  };

  const migrationHandler = async (position: {
    id: string;
    liquidity: BigNumber;
    owner: string;
    staked: boolean;
    tokenId: number;
  }) => {
    try {
      await migration(poolAddress, rewardTokenAddress, position.id, round);
      setUnstakeTokenId(position.tokenId);
    } catch (error) {
      console.error(error);
    }
  };

  const { value: mediaQuery } = useMediaQueryType();

  return mediaQuery === MediaQuery.PC ? (
    <div className="staking__lp__staked__table__content">
      <div className="staking__lp__staked__table__content--left">
        <div>
          <h2>{position.tokenId}</h2>
        </div>
        <div>
          <h2>{lpTokenType}</h2>
        </div>
        <div>
          <h2>$ {toCompact(stakedLiquidity)}</h2>
        </div>
        <div>
          <div
            onClick={() => unstakingHandler(position)}
            className="staking__lp__staked__table__content__button">
            <p>{t('staking.unstaking')}</p>
          </div>
          {/* <div 
              onClick={() => unstakingHandler(position)}
              className="staking__lp__staked__table__content__button"
            >
              <p>
                {t("staking.migration")}
              </p>
            </div> */}
          {!(round >= currentRound) &&
            moment().isBetween(startedDate, endedDate) && (
              <div
                onClick={() => migrationHandler(position)}
                className="staking__lp__staked__table__content__button">
                <p>{t('staking.migration')}</p>
              </div>
            )}
        </div>
      </div>

      <div className="staking__lp__staked__table__content--center">
        <div />
      </div>
      <div className="staking__lp__staked__table__content--right">
        <div>
          <div className="staking__lp__staked__table__content--right__image">
            <img src={tokenImg} />
            <h2>{rewardTokenType}</h2>
          </div>
          <div className="staking__lp__staked__table__content--right__reward">
            {rewardToken > 0.0001 ? (
              <CountUp
                className="staking__lp__staked__table__content--right__reward__amount"
                start={beforeRewardToken}
                end={rewardToken}
                formattingFn={(number) => {
                  return formatDecimalFracionDigit(number, 4);
                }}
                duration={1}
                decimals={4}
              />
            ) : (
              <h2 className="staking__lp__staked__table__content--right__reward__amount">
                0.0000...
              </h2>
            )}
            <h2 className="staking__lp__staked__table__content--right__reward__unit">
              &nbsp;{rewardTokenType}
            </h2>
          </div>
        </div>
        <div>
          <div className="staking__lp__staked__table__content--right__image">
            <img src={elfi} />
            <h2>{Token.ELFI}</h2>
          </div>
          <div className="staking__lp__staked__table__content--right__reward">
            {expectedReward?.elfiReward > 0.0001 ? (
              <CountUp
                className="staking__lp__staked__table__content--right__reward__amount"
                start={expectedReward?.beforeElfiReward}
                end={expectedReward?.elfiReward}
                formattingFn={(number) => {
                  return formatDecimalFracionDigit(number, 4);
                }}
                duration={1}
                decimals={4}
              />
            ) : (
              <h2 className="staking__lp__staked__table__content--right__reward__amount">
                0.0000...
              </h2>
            )}
            <h2 className="staking__lp__staked__table__content--right__reward__unit">
              &nbsp;ELFI
            </h2>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="staking__lp__staked__table__content__wrapper">
      <div className="staking__lp__staked__table__content">
        <div className="staking__lp__staked__table__content--left">
          <div>
            <p>ID</p>
            <h2>{position.tokenId}</h2>
          </div>
          <div>
            <p>{t('lpstaking.staked_lp_token_type')}</p>
            <h2>{lpTokenType}</h2>
          </div>
          <div>
            <p>{t('lpstaking.liquidity')}</p>
            <h2>$ {toCompact(stakedLiquidity)}</h2>
          </div>
          <div>
            <div
              onClick={() => unstakingHandler(position)}
              className="staking__lp__staked__table__content__button">
              <p>{t('staking.unstaking')}</p>
            </div>
            {!(round >= currentRound) &&
              moment().isBetween(startedDate, endedDate) && (
                <div
                  onClick={() => migrationHandler(position)}
                  className="staking__lp__staked__table__content__button">
                  <p>{t('staking.migration')}</p>
                </div>
              )}
          </div>
        </div>

        <div className="staking__lp__staked__table__content--center">
          <div />
        </div>
        <div className="staking__lp__staked__table__content--right">
          <div className="staking__lp__staked__table__content--right__header">
            <p>{t('lpstaking.expected_reward')}</p>
          </div>
          <div className="staking__lp__staked__table__content--right__body">
            <div>
              <div className="staking__lp__staked__table__content--right__image">
                <img src={tokenImg} />
                <h2>{rewardTokenType}</h2>
              </div>
              <div className="staking__lp__staked__table__content--right__reward">
                {rewardToken > 0.0001 ? (
                  <CountUp
                    className="staking__lp__staked__table__content--right__reward__amount"
                    start={beforeRewardToken}
                    end={rewardToken}
                    formattingFn={(number) => {
                      return formatDecimalFracionDigit(number, 4);
                    }}
                    duration={1}
                    decimals={4}
                  />
                ) : (
                  <h2 className="staking__lp__staked__table__content--right__reward__amount">
                    0.0000...
                  </h2>
                )}
                <h2 className="staking__lp__staked__table__content--right__reward__unit">
                  &nbsp;{rewardTokenType}
                </h2>
              </div>
            </div>
            <div>
              <div className="staking__lp__staked__table__content--right__image">
                <img src={elfi} />
                <h2>{Token.ELFI}</h2>
              </div>
              <div className="staking__lp__staked__table__content--right__reward">
                {expectedReward?.elfiReward > 0.0001 ? (
                  <CountUp
                    className="staking__lp__staked__table__content--right__reward__amount"
                    start={expectedReward?.beforeElfiReward}
                    end={expectedReward?.elfiReward}
                    formattingFn={(number) => {
                      return formatDecimalFracionDigit(number, 4);
                    }}
                    duration={1}
                    decimals={4}
                  />
                ) : (
                  <h2 className="staking__lp__staked__table__content--right__reward__amount">
                    0.0000...
                  </h2>
                )}
                <h2 className="staking__lp__staked__table__content--right__reward__unit">
                  &nbsp;{rewardTokenType}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakedLpItem;
