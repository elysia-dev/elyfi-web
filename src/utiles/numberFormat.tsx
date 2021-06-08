const numberFormat = (inputNumber: number) => {
  const si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: " K" },
    { value: 1E6, symbol: " M" },
    { value: 1E9, symbol: " B" },
    { value: 1E12, symbol: " T" },
    { value: 1E15, symbol: " P" },
    { value: 1E18, symbol: " E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (inputNumber >= si[i].value) {
      break;
    }
  }
  return (inputNumber / si[i].value).toFixed(2).replace(rx, "$1") + si[i].symbol;
}

export default numberFormat;