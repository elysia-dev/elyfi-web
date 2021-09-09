import { BigNumber, constants, utils } from 'ethers';
import React, { useState } from 'react'
import ELFI from 'src/assets/images/ELFI.png';
import { formatComma } from 'src/utiles/formatters';
import envs from 'src/core/envs';
import { useTranslation } from 'react-i18next';
import useWatingTx from 'src/hooks/useWaitingTx';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Token from 'src/enums/Token';
import moment from 'moment';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import useStakingPool from 'src/hooks/useStakingPool';
import useERC20Info from 'src/hooks/useERC20Info';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import ReactGA from "react-ga";
import useTxTracking from 'src/hooks/useTxTracking';
import { textSpanOverlapsWith } from 'typescript';
import txStatus from 'src/enums/txStatus';
import StakingPoolStatus from 'src/enums/StakingPoolStatus';
import TxContext, { initialTxContext, ITxContext} from 'src/contexts/TxContext';

const TxProvider: React.FunctionComponent = (props) => {

  const [state, setState] = useState<ITxContext>(initialTxContext);
  
  const { waiting, wait } = useWatingTx();
  const initTxTracker = useTxTracking();


  const setTransaction = (tx: any, tracker: any, pending: () => void, callback: () => void) => {
    tracker.created();
    console.log(tx);
    setState({ ...state, txStatus: txStatus.PENDING, txWaiting: true })
    window.localStorage.setItem("@txLoad", "true");
    pending();
    wait(
      tx as any,
      () => {
        callback();
        setState({ ...state, txStatus: txStatus.CONFIRM, txWaiting: false })
        window.localStorage.setItem("@txLoad", "false");
      }
    )
    
    // .then((tx) => ).catch(() => {
    //   tracker.canceled();
    //   setState({ ...state, txStatus: txStatus.FAIL, txWaiting: false })
    // })
  }


  return (
    <TxContext.Provider value={{
      ...state,
      setTransaction
    }}>
      {props.children}
    </TxContext.Provider>
  )
}

export default TxProvider
