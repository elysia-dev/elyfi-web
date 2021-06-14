
export type MintedTokenType = {
  tokenName: string;
  holder?: string;
  image: string;
  minted?: {
    elfi: number;
    walletBalance: number
  }
}