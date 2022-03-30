import {
  ERC20__factory,
  IncentivePool__factory,
} from '@elysia-dev/contract-typechain';
import { providers, utils } from 'ethers';
import { act } from 'react-test-renderer';
import envs from 'src/core/envs';

const provider = new providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC);
const bscProvider = new providers.JsonRpcProvider(envs.jsonRpcUrl.bsc);
const account = '0xB0B02B984083dFF47A6CFD86Bc7E6DbeA2005dab';

describe('useBalances hooks', () => {
  test('USDT balances', async () => {
    // const { result } = renderHook(() => useBalances(() => {}));
    let balance: any;
    await act(async () => {
      balance = await ERC20__factory.connect(
        envs.token.usdtAddress,
        provider as any,
      ).balanceOf(account);
    });
    expect(utils.formatUnits(balance, 6)).toBeDefined();
  });

  test('DAI balances', async () => {
    let balance: any;
    await act(async () => {
      balance = await ERC20__factory.connect(
        envs.token.daiAddress,
        provider as any,
      ).balanceOf(account);
    });
    expect(utils.formatEther(balance)).toBeDefined();
  });

  test('BUSD balances', async () => {
    let balance: any;
    await act(async () => {
      balance = await ERC20__factory.connect(
        envs.token.busdAddress,
        bscProvider as any,
      ).balanceOf(account);
    });
    expect(utils.formatEther(balance)).toBeDefined();
  });

  test('USDT deposit amount', async () => {
    let deposit: any;
    await act(async () => {
      deposit = await ERC20__factory.connect(
        '0xe0bda8e3a27e889837ae37970fe97194453ee79c',
        provider,
      ).balanceOf(account);
    });
    expect(utils.formatUnits(deposit, 6)).toBeDefined();
  });

  test('DAI deposit amount', async () => {
    let deposit: any;
    await act(async () => {
      deposit = await ERC20__factory.connect(
        '0x527c901e05228f54a9a63151a924a97622f9f173',
        provider,
      ).balanceOf(account);
    });
    expect(utils.formatEther(deposit)).toBeDefined();
  });

  test('BUSD deposit amount', async () => {
    let deposit: any;
    await act(async () => {
      deposit = await ERC20__factory.connect(
        '0x7ec8d3bdf0d3f2518698ed0c620a2aaed5800b12',
        bscProvider,
      ).balanceOf(account);
    });
    expect(utils.formatEther(deposit)).toBeDefined();
  });

  test('USDT pool additional incentive', async () => {
    let incentive: any;
    await act(async () => {
      incentive = await IncentivePool__factory.connect(
        envs.incentivePool.currentUSDTIncentivePool,
        provider,
      ).getUserIncentive(account);
    });
    expect(utils.formatEther(incentive)).toBeDefined();
  });

  test('DAI pool additional incentive', async () => {
    let incentive: any;
    await act(async () => {
      incentive = await IncentivePool__factory.connect(
        envs.incentivePool.currentDaiIncentivePool,
        provider,
      ).getUserIncentive(account);
    });
    expect(utils.formatEther(incentive)).toBeDefined();
  });

  test('BUSD pool additional incentive', async () => {
    let incentive: any;
    await act(async () => {
      incentive = await IncentivePool__factory.connect(
        envs.incentivePool.busdIncentivePoolAddress,
        bscProvider,
      ).getUserIncentive(account);
    });
    expect(utils.formatEther(incentive)).toBeDefined();
  });
});
