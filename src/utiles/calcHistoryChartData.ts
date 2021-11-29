import {
  GetAllReserves_reserves,
  GetAllReserves_reserves_reserveHistory,
} from 'src/queries/__generated__/GetAllReserves';
import moment from 'moment';
import { BigNumber, utils } from 'ethers';
import calcMiningAPR from './calcMiningAPR';
import { toCompact } from './formatters';

interface ICalculatedData extends GetAllReserves_reserves_reserveHistory {
  selectedAmount: string;
  calculatedAPY: number;
}

const calcHistoryChartData = (
  data: GetAllReserves_reserves,
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
  const histories = times.reduce(
    (res: GetAllReserves_reserves_reserveHistory[], time, index) => {
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
              } as GetAllReserves_reserves_reserveHistory);
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
              } as GetAllReserves_reserves_reserveHistory)),
      );

      return res;
    },
    [],
  );

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

  return calculatedData.map((d, _x) => {
    return [
      moment(d.timestamp * 1000).format('MMMM DD'),
      parseInt(utils.formatUnits(d.selectedAmount, decimals), 10),
      toCompact(d.calculatedAPY),
      (d.calculatedAPY / divider) * base + base * 1.2,
      '$ ' +
        toCompact(parseInt(utils.formatUnits(d.selectedAmount, decimals), 10)),
    ];
  });
};

export default calcHistoryChartData;
