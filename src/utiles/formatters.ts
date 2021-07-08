import { BigNumber, utils } from "ethers"

export const daiToUsd = (value: any) => new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
  parseInt(
    utils.formatEther(
      value
    )
  )
);

export const formatComma = (value: BigNumber) => new Intl.NumberFormat('en').format(
  parseInt(
    utils.formatEther(
      value
    )
  )
);

export const formatCommaSmall = (value: BigNumber) => new Intl.NumberFormat('en', { maximumFractionDigits: 6 }).format(
  parseFloat(
    utils.formatEther(
      value
    )
  )
);

export const toPercent = (value: any) => `${toCompact(parseFloat(utils.formatUnits(value, 25)))}%`

export const toCompact = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" }).format(value);

export const toCompactForBignumber = (value: BigNumber) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" }).format(
  parseInt(
    utils.formatEther(
      value
    )
  )
);