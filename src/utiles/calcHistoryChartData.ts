import moment from 'moment';
import { BigNumber, utils } from 'ethers';
import envs from 'src/core/envs';
import {
  IReserveHistory,
  IReserveSubgraphData,
} from 'src/contexts/SubgraphContext';
import Token from 'src/enums/Token';
import calcMiningAPR from './calcMiningAPR';
import { toCompact } from './formatters';
import { busd3xRewardEvent } from './busd3xRewardEvent';

interface ICalculatedData extends IReserveHistory {
  selectedAmount: string;
  calculatedAPY: number;
}

const calcHistoryChartData = (
  data: IReserveSubgraphData,
  historyType: 'borrow' | 'deposit',
  poolDayData: {
    token1Price: string;
    date: number;
  }[],
  decimals: number,
): (string | number)[][] => {
  const current = moment();
  const times = Array(30)
    .fill(0)
    .map((_item, index) => {
      return moment(current).subtract(30 - index, 'days');
    });

  const prices = times.reduce(
    (res: { token1Price: string; date: number }[], time) => {
      const item = poolDayData.find(
        (poolDatum) =>
          moment(poolDatum.date * 1000).format('L') === time.format('L'),
      );

      res.push(
        item || {
          token1Price: res[res.length - 1]?.token1Price || '0.1',
          date: time.unix(),
        },
      );

      return res;
    },
    [],
  );
  const histories = times.reduce((res: IReserveHistory[], time, index) => {
    let item = [...data.reserveHistory]
      .reverse()
      .find(
        (history) =>
          moment(history.timestamp * 1000).format('L') === time.format('L'),
      );

    if (index === 0 && !item) {
      item =
        data.reserveHistory[0] &&
        data.reserveHistory[0].timestamp <= time.unix()
          ? data.reserveHistory[0]!
          : ({
              id: '0x',
              borrowAPY: '0',
              depositAPY: '0',
              totalBorrow: '0',
              totalDeposit: '0',
              timestamp: time.unix(),
            } as IReserveHistory);
    }

    res.push(
      item ||
        (res.length > 0
          ? {
              ...res[res.length - 1],
              timestamp: time.unix(),
            }
          : ({
              id: '0x',
              borrowAPY: '0',
              depositAPY: '0',
              totalBorrow: '0',
              totalDeposit: '0',
              timestamp: time.unix(),
            } as IReserveHistory)),
    );

    return res;
  }, []);

  const avgPrice =
    prices.reduce((sum, value) => sum + parseFloat(value.token1Price), 0) /
    prices.length;

  const calculatedData: ICalculatedData[] = histories.map((data, index) => {
    return {
      ...data,
      selectedAmount:
        historyType === 'deposit' ? data.totalDeposit : data.totalBorrow,
      calculatedAPY: parseFloat(
        historyType === 'deposit'
          ? utils.formatUnits(
              BigNumber.from(data.depositAPY).add(
                calcMiningAPR(
                  parseFloat(prices[index].token1Price) || avgPrice,
                  BigNumber.from(data.totalDeposit),
                  decimals,
                ),
              ),
              25,
            )
          : utils.formatUnits(data.borrowAPY, 25),
      ),
    } as ICalculatedData;
  });

  const divider =
    calculatedData.reduce(
      (res, cur) => (res < cur.calculatedAPY ? cur.calculatedAPY : res),
      0,
    ) || 1;

  const base = Math.round(
    calculatedData.reduce(
      (res, cur) =>
        res < parseInt(utils.formatUnits(cur.selectedAmount, decimals), 10)
          ? parseInt(utils.formatUnits(cur.selectedAmount, decimals), 10)
          : res,
      0,
    ) || 1,
  );

  const test: any[] = [];

  calculatedData.forEach((d, _x) => {
    test.push({
      name: moment(d.timestamp * 1000).format('YY.MM.DD'),
      // a: parseInt(utils.formatUnits(d.selectedAmount, decimals), 10) * 3,
      lineYield: ((d.calculatedAPY / divider) * base + base * 1.2) * 1.4,
      total:
        '$ ' +
        toCompact(parseInt(utils.formatUnits(d.selectedAmount, decimals), 10)),
      barTotal: parseInt(utils.formatUnits(d.selectedAmount, decimals), 10) * 2,
      // c: (d.calculatedAPY / divider) * base + base * 1.2,
      yield: toCompact(
        d.calculatedAPY *
          (data.id === envs.busdAddress && historyType === 'deposit'
            ? moment(d.timestamp * 1000).isBetween(
                '2022.01.20 19:00:00 +09:00',
                '2022.01.26 19:00:00 +09:00',
              )
              ? 3
              : 1
            : 1),
      ),
    });
  });
  return test;
};

export default calcHistoryChartData;
