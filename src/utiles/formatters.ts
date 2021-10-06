import { BigNumber, utils } from "ethers"

export const daiToUsd = (value: any) => new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
  parseFloat(
    utils.formatEther(
      value
    )
  )
);

export const formatComma = (value: BigNumber) => new Intl.NumberFormat('en').format(
  parseFloat(
    utils.formatEther(
      value
    )
  )
);
export const formatCommaWithDigits = (value: BigNumber, digits: number) => new Intl.NumberFormat('en', { maximumFractionDigits: digits }).format(
  parseFloat(
    utils.formatEther(
      value
    )
  )
);
export const formatCommaFillZero = (value: BigNumber) => {
  if (value.isZero()) {
    return "0"
  }
  return new Intl.NumberFormat('en', { minimumFractionDigits: 8, maximumFractionDigits: 8 }).format(
    parseFloat(
      utils.formatEther(
        value
      )
    )
  )
}

export const formatCommaSmall = (value: BigNumber) => {
  if (value.isZero()) {
    return "0"
  }

  return formatSixFracionDigit(
    parseFloat(
      utils.formatEther(
        value
      )
    )
  )
}

export const formatSixFracionDigit = (value: number) => {
  if (value <= 0.0000001) {
    return "0";
  }
  return new Intl.NumberFormat(
    'en', { maximumFractionDigits: 6, minimumFractionDigits: 6 }
  ).format(
    value
  );
}

export const toPercent = (value: any) => `${toCompact(parseFloat(utils.formatUnits(value, 25)))}%`
export const toPercentWithoutSign = (value: any) => `${toCompact(parseFloat(utils.formatUnits(value, 25)))}`

export const toCompact = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" }).format(value);

export const toCompactForBignumber = (value: BigNumber | number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, notation: "compact", compactDisplay: "short" }).format(
  parseFloat(
    utils.formatEther(
      value
    )
  )
);