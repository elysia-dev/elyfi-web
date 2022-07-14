/// <reference types="react-scripts" />

interface Window {
  ethereum?: {
    isMetaMask?: true;
    isImToken?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    enable?: () => Promise<void>;
    request?: any;
  };
  web3?: {};
}

declare module 'jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}
