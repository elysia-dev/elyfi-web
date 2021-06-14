
export type DepositTokenType = {
  tokenName: string;
  holder?: string;
  image: string;
  deposit?: {
    balance: number;
    apyRate: number;
    aprRate: number;
    total: number;
  };
}