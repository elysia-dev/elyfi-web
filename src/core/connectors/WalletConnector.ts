/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line max-classes-per-file
import { ConnectorUpdate } from '@web3-react/types';
import { AbstractConnector } from '@web3-react/abstract-connector';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { setWalletConnect } from 'src/hooks/isWalletConnect';

export class UserRejectedRequestError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = 'The user rejected the request.';
  }
}

interface WalletConnectConnectorArguments {
  rpc: { [chainId: number]: string };
  preferredNetworkId?: number;
  bridge?: string;
  qrcode?: boolean;
  pollingInterval?: number;
  qrcodeModalOptions?: { mobileLinks: string[] };
  infuraId?: string;
}

export default class WalletConnectConnector extends AbstractConnector {
  private readonly rpc: { [chainId: number]: string };
  private readonly preferredNetworkId?: number;
  private readonly bridge?: string;
  private readonly qrcode?: boolean;
  private readonly pollingInterval?: number;
  private readonly qrcodeModalOptions?: { mobileLinks: string[] };
  private readonly infuraId?: string;

  public walletConnectProvider?: any;

  constructor({
    rpc,
    bridge,
    qrcode,
    pollingInterval,
    preferredNetworkId,
    qrcodeModalOptions,
    infuraId,
  }: WalletConnectConnectorArguments) {
    super({ supportedChainIds: Object.keys(rpc).map((k) => Number(k)) });

    this.rpc = rpc;
    this.bridge = bridge;
    this.qrcode = qrcode;
    this.preferredNetworkId = 1;
    this.pollingInterval = pollingInterval;
    this.qrcodeModalOptions = qrcodeModalOptions;
    this.infuraId = infuraId;

    this.handleChainChanged = this.handleChainChanged.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
  }

  private handleChainChanged(chainId: number | string): void {
    // if (__DEV__) {
    //   console.log("Handling 'chainChanged' event with payload", chainId);
    // }
    this.emitUpdate({
      // chainId: [1, 56, 97].includes(Number(chainId)) ? chainId : 1,
      chainId,
    });
  }

  private handleAccountsChanged(accounts: string[]): void {
    // if (__DEV__) {
    //   console.log("Handling 'accountsChanged' event with payload", accounts);
    // }
    this.emitUpdate({ account: accounts[0] });
  }

  private handleDisconnect(): void {
    // if (__DEV__) {
    //   console.log("Handling 'disconnect' event");
    // }
    this.emitDeactivate();
    // we have to do this because of a @walletconnect/web3-provider bug
    if (this.walletConnectProvider) {
      this.walletConnectProvider.stop();
      this.walletConnectProvider.removeListener(
        'chainChanged',
        this.handleChainChanged,
      );
      this.walletConnectProvider.removeListener(
        'accountsChanged',
        this.handleAccountsChanged,
      );
      this.walletConnectProvider = undefined;
    }

    this.emitDeactivate();
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.walletConnectProvider) {
      //   const WalletConnectProvider = await import(
      //     '@walletconnect/web3-provider'
      //   ).then((m) => m?.default ?? m);
      this.walletConnectProvider = new WalletConnectProvider({
        bridge: this.bridge,
        rpc: this.rpc,
        qrcode: this.qrcode,
        pollingInterval: this.pollingInterval,
        chainId: this.preferredNetworkId,
        infuraId: this.infuraId,
        qrcodeModalOptions: this.qrcodeModalOptions,
      });
    }

    const account = await this.walletConnectProvider
      .enable()
      .then((accounts: string[]): string => {
        setWalletConnect('walletConnect');
        return accounts[0];
      })
      .catch((error: Error): void => {
        setWalletConnect('');
        // TODO ideally this would be a better check
        if (error.message === 'User closed modal') {
          throw new UserRejectedRequestError();
        }

        throw error;
      });

    this.walletConnectProvider.on('disconnect', this.handleDisconnect);
    this.walletConnectProvider.on('chainChanged', this.handleChainChanged);
    this.walletConnectProvider.on(
      'accountsChanged',
      this.handleAccountsChanged,
    );

    return { provider: this.walletConnectProvider, account };
  }

  public async getProvider(): Promise<any> {
    return this.walletConnectProvider;
  }

  public async getChainId(): Promise<number | string> {
    return this.walletConnectProvider.send('eth_chainId');
  }

  public async getAccount(): Promise<null | string> {
    return this.walletConnectProvider
      .send('eth_accounts')
      .then((accounts: string[]): string => accounts[0]);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async deactivate() {
    setWalletConnect('');
    if (this.walletConnectProvider) {
      await this.walletConnectProvider.close();
    }
  }

  public async close() {
    await this.walletConnectProvider?.close();
  }
}
