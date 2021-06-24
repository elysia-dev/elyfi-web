import { utils } from "ethers"

export const daiToUsd = (value: any) => new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
  parseInt(
    utils.formatEther(
      value
    )
  )
);

export const toPercent = (value: any) => `${parseFloat(utils.formatUnits(value, 25)).toFixed(2)}%`