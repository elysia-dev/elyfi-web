/// <reference types="react-scripts" />

interface Window {
  ethereum?: {
    isMetaMask?: true;
    isImToken?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    enable?: () => Promise<void>;
  };
  web3?: {};
}

declare module 'jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement;
}
