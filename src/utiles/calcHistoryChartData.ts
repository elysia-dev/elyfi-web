import { GetAllReserves_reserves, GetAllReserves_reserves_reserveHistory } from "src/queries/__generated__/GetAllReserves";
import moment from 'moment'
import { BigNumber, utils } from "ethers";
import calcMiningAPR from "./calcMiningAPR";
import { daiToUsd, toCompact } from "./formatters";

interface ICalculatedData extends GetAllReserves_reserves_reserveHistory {
  selectedAmount: string,
  calculatedAPY: number,
}

const calcHistoryChartData = (data: GetAllReserves_reserves, historyType: 'borrow' | 'deposit') => {
  const reducedData = data.reserveHistory.reduce((res: GetAllReserves_reserves_reserveHistory[], cur) => {
    if (res.length === 0) {
      res.push(cur)
      return res;
    }

    const lastElement = res[res.length - 1];

    if (moment(cur.timestamp * 1000).format('YYYY-MM-DD') === moment(lastElement.timestamp * 1000).format('YYYY-MM-DD')) {
      res.pop();
    }

    res.push(cur);

    return res
  }, [])

  const emptyData = Array(7 - reducedData.length).fill(0).map((_data, index) => {
    const baseTime = reducedData.length > 0 ? moment(reducedData[0].timestamp * 1000) : moment();

    return {
      id: '0x',
      borrowAPY: '0',
      depositAPY: '0',
      totalBorrow: '0',
      totalDeposit: '0',
      timestamp: baseTime.subtract((index + 1), 'days').unix(),
    } as GetAllReserves_reserves_reserveHistory
  })

  const filledData = [...emptyData.reverse(), ...reducedData];

  const calculatedData: ICalculatedData[] = filledData.map((data) => {
    return {
      ...data,
      selectedAmount: historyType === 'deposit' ? data.totalDeposit : data.totalBorrow,
      calculatedAPY: parseFloat(
        historyType === 'deposit' ? utils.formatUnits(
          BigNumber.from(data.depositAPY).add(calcMiningAPR(BigNumber.from(data.totalDeposit))), 25
        ) : utils.formatUnits(data.borrowAPY, 25)
      )
    } as ICalculatedData
  })

  const divider = calculatedData.reduce((res, cur) =>
    res < cur.calculatedAPY ?
      cur.calculatedAPY :
      res,
    0
  ) || 1;

  const base = Math.round(
    calculatedData.reduce((res, cur) =>
      res < parseInt(utils.formatEther(cur.selectedAmount)) ?
        parseInt(utils.formatEther(cur.selectedAmount)) :
        res,
      0
    ) || 1
  )

  return calculatedData.map((d, _x) => {
    return [
      moment(d.timestamp * 1000).format("MMMM DD"),
      parseInt(utils.formatEther(d.selectedAmount)),
      daiToUsd(d.selectedAmount),
      d.calculatedAPY / divider * base + base * 1.2,
      toCompact(d.calculatedAPY)
    ]
  })
}

export default calcHistoryChartData;